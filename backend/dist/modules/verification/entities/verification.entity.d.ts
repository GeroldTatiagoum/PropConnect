import { User } from '../../users/entities/user.entity';
export declare enum VerificationType {
    KYC_USER = "kyc_user",
    KYC_SELLER = "kyc_seller",
    PROPERTY_DOCUMENTS = "property_documents",
    FINANCIAL_CAPACITY = "financial_capacity"
}
export declare enum VerificationStatus {
    PENDING = "pending",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare enum VerificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export interface ChecklistItem {
    id: string;
    name: string;
    required: boolean;
    completed: boolean;
    notes: string;
}
export declare class Verification {
    id: string;
    userId: string | null;
    propertyId: string | null;
    user: User | null;
    verificationType: VerificationType;
    status: VerificationStatus;
    assignedBrokerId: string | null;
    assignedBroker: User | null;
    assignedAt: Date | null;
    priority: VerificationPriority;
    checklist: ChecklistItem[] | null;
    rejectionReason: string | null;
    rejectionDetails: Record<string, unknown> | null;
    completedBy: string | null;
    completedAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
}
//# sourceMappingURL=verification.entity.d.ts.map