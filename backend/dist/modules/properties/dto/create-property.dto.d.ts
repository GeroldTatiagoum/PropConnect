import { PropertyType, PropertyCondition } from '../entities/property.entity';
export declare class CreatePropertyDto {
    address: string;
    postalCode?: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    propertyType: PropertyType;
    roomsCount: number;
    bathroomsCount?: number;
    totalAreaSqm: number;
    landAreaSqm?: number;
    price: number;
    description?: string;
    amenities?: string[];
    condition?: PropertyCondition;
    yearBuilt?: number;
    isFurnished?: boolean;
    hasElevator?: boolean;
    hasParking?: boolean;
    hasTerrace?: boolean;
    hasGarden?: boolean;
    energyClass?: string;
}
//# sourceMappingURL=create-property.dto.d.ts.map