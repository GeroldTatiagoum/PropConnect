import { User } from '../../users/entities/user.entity';
import { PropertyMedia } from './property-media.entity';
export declare enum PropertyType {
    APARTMENT = "apartment",
    HOUSE = "house",
    VILLA = "villa",
    COMMERCIAL = "commercial",
    LAND = "land"
}
export declare enum PropertyStatus {
    DRAFT = "draft",
    PENDING_VERIFICATION = "pending_verification",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum PropertyCondition {
    NEW = "new",
    GOOD = "good",
    FAIR = "fair",
    NEEDS_RENOVATION = "needs_renovation"
}
export declare class Property {
    id: string;
    sellerId: string;
    seller: User;
    address: string;
    postalCode: string | null;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    propertyType: PropertyType;
    subType: string | null;
    roomsCount: number;
    bathroomsCount: number | null;
    totalAreaSqm: number;
    landAreaSqm: number | null;
    price: number;
    currency: string;
    description: string | null;
    amenities: string[] | null;
    status: PropertyStatus;
    publishedAt: Date | null;
    viewCount: number;
    contactRequestCount: number;
    yearBuilt: number | null;
    condition: PropertyCondition | null;
    heatingType: string | null;
    coolingType: string | null;
    isFurnished: boolean;
    hasElevator: boolean;
    hasParking: boolean;
    hasTerrace: boolean;
    hasGarden: boolean;
    energyClass: string | null;
    createdAt: Date;
    updatedAt: Date;
    media: PropertyMedia[];
    get pricePerSqm(): number;
}
//# sourceMappingURL=property.entity.d.ts.map