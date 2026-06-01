import { Repository } from 'typeorm';
import { MarketData } from './entities/market-data.entity';
import { Valuation } from './entities/valuation.entity';
import { Property } from '../properties/entities/property.entity';
import { RedisService } from '../../shared/services/redis.service';
import { LoggerService } from '../../shared/services/logger.service';
export declare class MarketplaceService {
    private readonly marketDataRepo;
    private readonly valuationRepo;
    private readonly propertyRepo;
    private readonly redis;
    private readonly logger;
    constructor(marketDataRepo: Repository<MarketData>, valuationRepo: Repository<Valuation>, propertyRepo: Repository<Property>, redis: RedisService, logger: LoggerService);
    getMarketOverview(params: {
        latitude: number;
        longitude: number;
        radius: number;
        propertyType?: string;
    }): Promise<{
        zone: {
            name: string;
            latitude: number;
            longitude: number;
        };
        pricePerSqm: {
            average: number;
            min: number;
            max: number;
            trend: string;
        };
        marketLiquidity: {
            averageDaysToSale: number;
            trend: string;
        };
        activeListings: number;
        priceHistory: {
            month: string;
            pricePerSqm: number;
        }[];
    }>;
    getOrComputeValuation(propertyId: string): Promise<Valuation>;
    getComparables(propertyId: string, maxResults?: number, similarity?: number): Promise<{
        referenceProperty: Partial<Property>;
        comparables: Array<Partial<Property> & {
            similarity: number;
            differencePercentage: number;
        }>;
    }>;
    private computeValuation;
    private computeSimilarity;
}
//# sourceMappingURL=marketplace.service.d.ts.map