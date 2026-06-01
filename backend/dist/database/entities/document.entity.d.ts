import { User } from '../../modules/users/entities/user.entity';
export declare enum DocumentType {
    IDENTITY_CARD = "identity_card",
    PASSPORT = "passport",
    DRIVING_LICENSE = "driving_license",
    CADASTRAL_MAP = "cadastral_map",
    APE = "ape",
    FLOOR_PLAN = "floor_plan",
    UTILITY_BILL = "utility_bill",
    PROPERTY_DEED = "property_deed"
}
export declare enum DocumentSide {
    FRONT = "front",
    BACK = "back",
    FULL = "full"
}
export declare class Document {
    id: string;
    userId: string | null;
    propertyId: string | null;
    user: User | null;
    documentType: DocumentType;
    s3Path: string;
    s3Key: string;
    fileSizeBytes: number | null;
    fileMimeType: string | null;
    ocrExtractedText: string | null;
    isVerified: boolean;
    verifiedBy: string | null;
    verifiedAt: Date | null;
    verificationNotes: string | null;
    documentSide: DocumentSide;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
}
//# sourceMappingURL=document.entity.d.ts.map