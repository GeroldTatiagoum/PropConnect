export declare enum UserRole {
    SELLER = "seller",
    BUYER = "buyer",
    BROKER = "broker",
    ADMIN = "admin"
}
export declare enum KycStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: UserRole;
    kycStatus: KycStatus;
    isActive: boolean;
    lastLoginAt: Date | null;
    twoFaEnabled: boolean;
    twoFaSecret: string | null;
    profilePhotoUrl: string | null;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    get fullName(): string;
}
//# sourceMappingURL=user.entity.d.ts.map