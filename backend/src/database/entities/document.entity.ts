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
import { User } from '../../modules/users/entities/user.entity';

export enum DocumentType {
  IDENTITY_CARD = 'identity_card',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  CADASTRAL_MAP = 'cadastral_map',
  APE = 'ape',
  FLOOR_PLAN = 'floor_plan',
  UTILITY_BILL = 'utility_bill',
  PROPERTY_DEED = 'property_deed',
}

export enum DocumentSide {
  FRONT = 'front',
  BACK = 'back',
  FULL = 'full',
}

@Entity('documents')
@Index('idx_documents_user', ['userId'])
@Index('idx_documents_property', ['propertyId'])
@Index('idx_documents_type', ['documentType'])
@Index('idx_documents_verified', ['isVerified'])
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'document_type', type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @Column({ name: 's3_path', length: 500 })
  s3Path: string;

  @Column({ name: 's3_key', length: 500, unique: true })
  s3Key: string;

  @Column({ name: 'file_size_bytes', type: 'int', nullable: true })
  fileSizeBytes: number | null;

  @Column({ name: 'file_mime_type', type: 'varchar', length: 50, nullable: true })
  fileMimeType: string | null;

  @Column({ name: 'ocr_extracted_text', type: 'text', nullable: true })
  ocrExtractedText: string | null;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy: string | null;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date | null;

  @Column({ name: 'verification_notes', type: 'text', nullable: true })
  verificationNotes: string | null;

  @Column({
    name: 'document_side',
    type: 'enum',
    enum: DocumentSide,
    default: DocumentSide.FULL,
  })
  documentSide: DocumentSide;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;
}
