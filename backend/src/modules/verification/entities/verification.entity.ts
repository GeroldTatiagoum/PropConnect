import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VerificationType {
  KYC_USER = 'kyc_user',
  KYC_SELLER = 'kyc_seller',
  PROPERTY_DOCUMENTS = 'property_documents',
  FINANCIAL_CAPACITY = 'financial_capacity',
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum VerificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface ChecklistItem {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
  notes: string;
}

@Entity('verifications')
@Index('idx_verifications_status', ['status'])
@Index('idx_verifications_broker', ['assignedBrokerId'])
@Index('idx_verifications_user', ['userId'])
@Index('idx_verifications_property', ['propertyId'])
@Index('idx_verifications_priority', ['priority'])
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
  })
  verificationType: VerificationType;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ name: 'assigned_broker_id', type: 'uuid', nullable: true })
  assignedBrokerId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_broker_id' })
  assignedBroker: User | null;

  @Column({ name: 'assigned_at', type: 'timestamp', nullable: true })
  assignedAt: Date | null;

  @Column({
    type: 'enum',
    enum: VerificationPriority,
    default: VerificationPriority.MEDIUM,
  })
  priority: VerificationPriority;

  @Column({ type: 'jsonb', nullable: true })
  checklist: ChecklistItem[] | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ name: 'rejection_details', type: 'jsonb', nullable: true })
  rejectionDetails: Record<string, unknown> | null;

  @Column({ name: 'completed_by', type: 'uuid', nullable: true })
  completedBy: string | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;
}
