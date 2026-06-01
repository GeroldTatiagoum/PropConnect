export enum UserRole {
  SELLER = 'seller',
  BUYER = 'buyer',
  BROKER = 'broker',
  ADMIN = 'admin',
}

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  kycStatus: KycStatus;
  isActive: boolean;
  lastLoginAt: string | null;
  twoFaEnabled: boolean;
  profilePhotoUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
}
