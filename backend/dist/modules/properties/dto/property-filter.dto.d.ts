import { PropertyStatus, PropertyType } from '../entities/property.entity';
export declare class PropertyFilterDto {
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
    propertyType?: PropertyType;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
    sort?: string;
}
//# sourceMappingURL=property-filter.dto.d.ts.map