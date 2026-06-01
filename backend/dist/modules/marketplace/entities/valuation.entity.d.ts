import { Property } from '../../properties/entities/property.entity';
export declare class Valuation {
    id: string;
    propertyId: string;
    property: Property;
    estimatedValue: number;
    valueRangeLow: number | null;
    valueRangeHigh: number | null;
    confidenceScore: number | null;
    factors: Record<string, number> | null;
    algorithmVersion: string | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=valuation.entity.d.ts.map