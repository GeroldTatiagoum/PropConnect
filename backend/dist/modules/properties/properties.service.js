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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./entities/property.entity");
const user_entity_1 = require("../users/entities/user.entity");
const logger_service_1 = require("../../shared/services/logger.service");
const redis_service_1 = require("../../shared/services/redis.service");
const PROPERTY_CACHE_TTL = 300; // 5 minutes
let PropertiesService = class PropertiesService {
    constructor(propertyRepo, redis, logger) {
        this.propertyRepo = propertyRepo;
        this.redis = redis;
        this.logger = logger;
    }
    async create(sellerId, dto) {
        const property = this.propertyRepo.create({ ...dto, sellerId });
        const saved = await this.propertyRepo.save(property);
        this.logger.log(`Property created: ${saved.id}`, 'PropertiesService');
        return saved;
    }
    async findById(id) {
        const cacheKey = `property:${id}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const property = await this.propertyRepo.findOne({
            where: { id },
            relations: ['seller', 'media'],
        });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        if (property.status === property_entity_1.PropertyStatus.PUBLISHED) {
            await this.redis.setJson(cacheKey, property, PROPERTY_CACHE_TTL);
        }
        return property;
    }
    async findAll(filters, requestingUserId, requestingUserRole) {
        const { status, minPrice, maxPrice, rooms, propertyType, latitude, longitude, radius, page = 1, limit = 20, sort = 'date_desc', } = filters;
        const qb = this.propertyRepo.createQueryBuilder('p')
            .leftJoinAndSelect('p.media', 'm')
            .where('1=1');
        // Visibility rules
        if (!requestingUserRole || requestingUserRole === user_entity_1.UserRole.BUYER) {
            qb.andWhere('p.status = :pub', { pub: property_entity_1.PropertyStatus.PUBLISHED });
        }
        else if (requestingUserRole === user_entity_1.UserRole.SELLER && requestingUserId) {
            qb.andWhere('(p.status = :pub OR p.seller_id = :sid)', {
                pub: property_entity_1.PropertyStatus.PUBLISHED,
                sid: requestingUserId,
            });
        }
        if (status)
            qb.andWhere('p.status = :status', { status });
        if (minPrice !== undefined)
            qb.andWhere('p.price >= :minPrice', { minPrice });
        if (maxPrice !== undefined)
            qb.andWhere('p.price <= :maxPrice', { maxPrice });
        if (rooms !== undefined)
            qb.andWhere('p.rooms_count = :rooms', { rooms });
        if (propertyType)
            qb.andWhere('p.property_type = :propertyType', { propertyType });
        if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
            qb.andWhere(`(6371 * acos(
          cos(radians(:lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(p.latitude))
        )) <= :radius`, { lat: latitude, lng: longitude, radius });
        }
        const [column, direction] = this.parseSortParam(sort);
        qb.orderBy(`p.${column}`, direction);
        const total = await qb.getCount();
        const data = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const pages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                pages,
                hasNext: page < pages,
                hasPrev: page > 1,
            },
        };
    }
    async update(id, sellerId, patch) {
        const property = await this.findById(id);
        if (property.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        if (property.status === property_entity_1.PropertyStatus.ARCHIVED) {
            throw new common_1.ForbiddenException('Cannot update an archived listing');
        }
        Object.assign(property, patch);
        const updated = await this.propertyRepo.save(property);
        await this.redis.del(`property:${id}`);
        return updated;
    }
    async incrementViewCount(id) {
        await this.propertyRepo.increment({ id }, 'viewCount', 1);
        await this.redis.del(`property:${id}`);
    }
    async changeStatus(id, status, actorRole) {
        const property = await this.findById(id);
        const brokerOrAdmin = [user_entity_1.UserRole.BROKER, user_entity_1.UserRole.ADMIN].includes(actorRole);
        if (status === property_entity_1.PropertyStatus.PUBLISHED && !brokerOrAdmin) {
            throw new common_1.ForbiddenException('Only a broker or admin can publish listings');
        }
        property.status = status;
        if (status === property_entity_1.PropertyStatus.PUBLISHED) {
            property.publishedAt = new Date();
        }
        const saved = await this.propertyRepo.save(property);
        await this.redis.del(`property:${id}`);
        return saved;
    }
    parseSortParam(sort) {
        const map = {
            date_desc: ['createdAt', 'DESC'],
            date_asc: ['createdAt', 'ASC'],
            price_desc: ['price', 'DESC'],
            price_asc: ['price', 'ASC'],
        };
        return map[sort] ?? ['createdAt', 'DESC'];
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService,
        logger_service_1.LoggerService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map