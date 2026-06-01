import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketData } from './entities/market-data.entity';
import { Valuation } from './entities/valuation.entity';
import { Property } from '../properties/entities/property.entity';
import { RedisService } from '../../shared/services/redis.service';
import { LoggerService } from '../../shared/services/logger.service';

const MARKET_CACHE_TTL = 3600; // 1 hour

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepo: Repository<MarketData>,
    @InjectRepository(Valuation)
    private readonly valuationRepo: Repository<Valuation>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getMarketOverview(params: {
    latitude: number;
    longitude: number;
    radius: number;
    propertyType?: string;
  }): Promise<{
    zone: { name: string; latitude: number; longitude: number };
    pricePerSqm: { average: number; min: number; max: number; trend: string };
    marketLiquidity: { averageDaysToSale: number; trend: string };
    activeListings: number;
    priceHistory: { month: string; pricePerSqm: number }[];
  }> {
    const cacheKey = `market:${params.latitude}:${params.longitude}:${params.radius}:${params.propertyType ?? 'all'}`;
    const cached = await this.redis.getJson<ReturnType<typeof this.getMarketOverview>>(cacheKey);
    if (cached) return cached as Awaited<ReturnType<typeof this.getMarketOverview>>;

    const qb = this.marketDataRepo
      .createQueryBuilder('m')
      .where(
        `(6371 * acos(
          cos(radians(:lat)) * cos(radians(m.latitude)) *
          cos(radians(m.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(m.latitude))
        )) <= :radius`,
        { lat: params.latitude, lng: params.longitude, radius: params.radius },
      )
      .orderBy('m.date_recorded', 'DESC');

    if (params.propertyType) {
      qb.andWhere('m.property_type = :type', { type: params.propertyType });
    }

    const records = await qb.take(24).getMany();

    const latest = records[0];
    const oldest = records[records.length - 1];

    const trendPct =
      latest && oldest && oldest.avgPricePerSqm && latest.avgPricePerSqm
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

  async getOrComputeValuation(propertyId: string): Promise<Valuation> {
    const existing = await this.valuationRepo.findOne({ where: { propertyId } });

    if (
      existing &&
      existing.updatedAt > new Date(Date.now() - 7 * 24 * 3600 * 1000)
    ) {
      return existing;
    }

    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const estimated = await this.computeValuation(property);

    if (existing) {
      Object.assign(existing, estimated);
      return this.valuationRepo.save(existing);
    }

    const newValuation = this.valuationRepo.create({ propertyId, ...estimated });
    return this.valuationRepo.save(newValuation);
  }

  async getComparables(
    propertyId: string,
    maxResults = 10,
    similarity = 0.8,
  ): Promise<{
    referenceProperty: Partial<Property>;
    comparables: Array<Partial<Property> & { similarity: number; differencePercentage: number }>;
  }> {
    const reference = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!reference) throw new NotFoundException('Property not found');

    const candidates = await this.propertyRepo
      .createQueryBuilder('p')
      .where('p.id != :id', { id: propertyId })
      .andWhere('p.property_type = :type', { type: reference.propertyType })
      .andWhere('p.status = :status', { status: 'published' })
      .andWhere('ABS(p.total_area_sqm - :area) / :area <= 0.3', { area: reference.totalAreaSqm })
      .andWhere(
        `(6371 * acos(
          cos(radians(:lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(p.latitude))
        )) <= 5`,
        { lat: reference.latitude, lng: reference.longitude },
      )
      .take(maxResults * 3)
      .getMany();

    const scored = candidates
      .map((p) => ({
        ...p,
        similarity: this.computeSimilarity(reference, p),
        differencePercentage: Math.round(
          ((p.price - reference.price) / reference.price) * 1000,
        ) / 10,
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

  private async computeValuation(
    property: Property,
  ): Promise<Pick<Valuation, 'estimatedValue' | 'valueRangeLow' | 'valueRangeHigh' | 'confidenceScore' | 'factors' | 'algorithmVersion'>> {
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

  private computeSimilarity(reference: Property, candidate: Property): number {
    const areaRatio =
      1 - Math.abs(reference.totalAreaSqm - candidate.totalAreaSqm) / reference.totalAreaSqm;
    const priceRatio =
      1 - Math.abs(reference.price - candidate.price) / reference.price;
    const roomMatch = reference.roomsCount === candidate.roomsCount ? 1 : 0.7;

    return Math.round((areaRatio * 0.4 + priceRatio * 0.4 + roomMatch * 0.2) * 100) / 100;
  }
}
