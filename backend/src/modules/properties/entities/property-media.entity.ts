import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from './property.entity';

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
  FLOOR_PLAN = 'floor_plan',
  VIRTUAL_TOUR = 'virtual_tour',
}

@Entity('property_media')
@Index('idx_property_media_property', ['propertyId'])
@Index('idx_property_media_order', ['propertyId', 'displayOrder'])
export class PropertyMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id' })
  propertyId: string;

  @ManyToOne(() => Property, (p) => p.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'media_type', type: 'enum', enum: MediaType })
  mediaType: MediaType;

  @Column({ name: 's3_url', length: 500 })
  s3Url: string;

  @Column({ name: 's3_key', length: 500 })
  s3Key: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'file_size_bytes', type: 'int', nullable: true })
  fileSizeBytes: number | null;

  @Column({ name: 'display_order', type: 'smallint', default: 0 })
  displayOrder: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
