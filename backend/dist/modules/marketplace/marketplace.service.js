"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const market_data_entity_1 = require("./entities/market-data.entity");
const valuation_entity_1 = require("./entities/valuation.entity");
const property_entity_1 = require("../properties/entities/property.entity");
const redis_service_1 = require("../../shared/services/redis.service");
const logger_service_1 = require("../../shared/services/logger.service");
const MARKET_CACHE_TTL = 3600; // 1 hour
let MarketplaceService = class MarketplaceService {
    constructor(marketDataRepo, valuationRepo, propertyRepo, redis, logger) {
        this.marketDataRepo = marketDataRepo;
        this.valuationRepo = valuationRepo;
        this.propertyRepo = propertyRepo;
        this.redis = redis;
        this.logger = logger;
    }
    async getMarketOverview(params) {
        const cacheKey = `market:${params.latitude}:${params.longitude}:${params.radius}:${params.propertyType ?? 'all'}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const qb = this.marketDataRepo
            .createQueryBuilder('m')
            .where(`(6371 * acos(
          cos(radians(:lat)) * cos(radians(m.latitude)) *
          cos(radians(m.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(m.latitude))
        )) <= :radius`, { lat: params.latitude, lng: params.longitude, radius: params.radius })
            .orderBy('m.date_recorded', 'DESC');
        if (params.propertyType) {
            qb.andWhere('m.property_type = :type', { type: params.propertyType });
        }
        const records = await qb.take(24).getMany();
        const latest = records[0];
        const oldest = records[records.length - 1];
        const trendPct = latest && oldest && oldest.avgPricePerSqm && latest.avgPricePerSqm
            ? (((latest.avgPricePerSqm - oldest.avgPricePerSqm) / oldest.avgPricePerSqm) * 100).toFixed(1)
            : '0.0';
        const priceHistory = records
            .slice(0, 12)
            .map((r) => ({ month: r.dateRecorded, pricePerSqm: Number(r.avgPricePerSqm) }))
            .reverse();
        const result = {
            zone: {
                name: latest?.zoneName ?? 'Unknown',
                latitude: params.latitude,
                longitude: params.longitude,
            },
            pricePerSqm: {
                average: Number(latest?.avgPricePerSqm ?? 0),
                min: Number(latest?.minPricePerSqm ?? 0),
                max: Number(latest?.maxPricePerSqm ?? 0),
                trend: `${Number(trendPct) >= 0 ? '+' : ''}${trendPct}%`,
            },
            marketLiquidity: {
                averageDaysToSale: latest?.avgDaysToSale ?? 0,
                trend: '0%',
            },
            activeListings: latest?.activeListingsCount ?? 0,
            priceHistory,
        };
        await this.redis.setJson(cacheKey, result, MARKET_CACHE_TTL);
        return result;
    }
    async getOrComputeValuation(propertyId) {
        const existing = await this.valuationRepo.findOne({ where: { propertyId } });
        if (existing &&
            existing.updatedAt > new Date(Date.now() - 7 * 24 * 3600 * 1000)) {
            return existing;
        }
        const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        const estimated = await this.computeValuation(property);
        if (existing) {
            Object.assign(existing, estimated);
            return this.valuationRepo.save(existing);
        }
        const newValuation = this.valuationRepo.create({ propertyId, ...estimated });
        return this.valuationRepo.save(newValuation);
    }
    async getComparables(propertyId, maxResults = 10, similarity = 0.8) {
        const reference = await this.propertyRepo.findOne({ where: { id: propertyId } });
        if (!reference)
            throw new common_1.NotFoundException('Property not found');
        const candidates = await this.propertyRepo
            .createQueryBuilder('p')
            .where('p.id != :id', { id: propertyId })
            .andWhere('p.property_type = :type', { type: reference.propertyType })
            .andWhere('p.status = :status', { status: 'published' })
            .andWhere('ABS(p.total_area_sqm - :area) / :area <= 0.3', { area: reference.totalAreaSqm })
            .andWhere(`(6371 * acos(
          cos(radians(:lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(p.latitude))
        )) <= 5`, { lat: reference.latitude, lng: reference.longitude })
            .take(maxResults * 3)
            .getMany();
        const scored = candidates
            .map((p) => ({
            ...p,
            similarity: this.computeSimilarity(reference, p),
            differencePercentage: Math.round(((p.price - reference.price) / reference.price) * 1000) / 10,
        }))
            .filter((p) => p.similarity >= similarity)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxResults);
        return {
            referenceProperty: {
                id: reference.id,
                address: reference.address,
                price: reference.price,
                pricePerSqm: reference.pricePerSqm,
            },
            comparables: scored,
        };
    }
    async computeValuation(property) {
        const marketData = await this.marketDataRepo.findOne({
            where: { propertyType: property.propertyType },
            order: { dateRecorded: 'DESC' },
        });
        const basePricePerSqm = marketData?.avgPricePerSqm ?? property.pricePerSqm;
        const estimatedValue = Math.round(Number(basePricePerSqm) * property.totalAreaSqm);
        const variance = 0.05;
        return {
            estimatedValue,
            valueRangeLow: Math.round(estimatedValue * (1 - variance)),
            valueRangeHigh: Math.round(estimatedValue * (1 + variance)),
            confidenceScore: marketData ? 0.82 : 0.55,
            factors: {
                location: 0.35,
                size: 0.25,
                condition: 0.20,
                market_trend: 0.15,
                amenities: 0.05,
            },
            algorithmVersion: '1.0',
        };
    }
    computeSimilarity(reference, candidate) {
        const areaRatio = 1 - Math.abs(reference.totalAreaSqm - candidate.totalAreaSqm) / reference.totalAreaSqm;
        const priceRatio = 1 - Math.abs(reference.price - candidate.price) / reference.price;
        const roomMatch = reference.roomsCount === candidate.roomsCount ? 1 : 0.7;
        return Math.round((areaRatio * 0.4 + priceRatio * 0.4 + roomMatch * 0.2) * 100) / 100;
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(market_data_entity_1.MarketData)),
    __param(1, (0, typeorm_1.InjectRepository)(valuation_entity_1.Valuation)),
    __param(2, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService,
        logger_service_1.LoggerService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map