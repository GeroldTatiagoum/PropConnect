import { MarketplaceService } from './marketplace.service';
declare class MarketOverviewQuery {
    latitude: number;
    longitude: number;
    radius: number;
    propertyType?: string;
}
declare class ComparablesQuery {
    maxResults?: number;
    similarity?: number;
}
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    getOverview(query: MarketOverviewQuery): Promise<{
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
    getValuation(propertyId: string): Promise<import("./entities/valuation.entity").Valuation>;
    getComparables(propertyId: string, query: ComparablesQuery): Promise<{
        referenceProperty: Partial<import("../properties/entities/property.entity").Property>;
        comparables: Array<Partial<import("../properties/entities/property.entity").Property> & {
            similarity: number;
            differencePercentage: number;
        }>;
    }>;
}
export {};
//# sourceMappingURL=marketplace.controller.d.ts.map