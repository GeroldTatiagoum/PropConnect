import { Property } from './property.entity';
export declare enum MediaType {
    PHOTO = "photo",
    VIDEO = "video",
    FLOOR_PLAN = "floor_plan",
    VIRTUAL_TOUR = "virtual_tour"
}
export declare class PropertyMedia {
    id: string;
    propertyId: string;
    property: Property;
    mediaType: MediaType;
    s3Url: string;
    s3Key: string;
    thumbnailUrl: string | null;
    fileSizeBytes: number | null;
    displayOrder: number;
    title: string | null;
    description: string | null;
    createdAt: Date;
}
//# sourceMappingURL=property-media.entity.d.ts.map