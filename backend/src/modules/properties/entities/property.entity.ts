import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { PropertyMedia } from './property-media.entity';

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_VERIFICATION = 'pending_verification',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PropertyCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_RENOVATION = 'needs_renovation',
}

@Entity('properties')
@Index('idx_properties_seller', ['sellerId'])
@Index('idx_properties_status', ['status'])
@Index('idx_properties_type', ['propertyType'])
@Index('idx_properties_published', ['publishedAt'])
@Index('idx_properties_coords', ['latitude', 'longitude'])
@Index('idx_properties_price', ['price'])
@Check('valid_coords', '"latitude" >= -90 AND "latitude" <= 90 AND "longitude" >= -180 AND "longitude" <= 180')
export class Property {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ApiProperty()
  @Column({ length: 500 })
  address: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode: string | null;

  @ApiProperty()
  @Column({ length: 100 })
  city: string;

  @ApiProperty()
  @Column({ length: 50 })
  province: string;

  @Column({ length: 50, default: 'IT' })
  country: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @ApiProperty({ enum: PropertyType })
  @Column({ name: 'property_type', type: 'enum', enum: PropertyType })
  propertyType: PropertyType;

  @Column({ name: 'sub_type', type: 'varchar', length: 100, nullable: true })
  subType: string | null;

  @ApiProperty()
  @Column({ name: 'rooms_count', type: 'smallint' })
  roomsCount: number;

  @ApiProperty()
  @Column({ name: 'bathrooms_count', type: 'smallint', nullable: true })
  bathroomsCount: number | null;

  @ApiProperty()
  @Column({ name: 'total_area_sqm', type: 'decimal', precision: 10, scale: 2 })
  totalAreaSqm: number;

  @Column({ name: 'land_area_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  landAreaSqm: number | null;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ name: 'currency', length: 3, default: 'EUR' })
  currency: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', nullable: true })
  amenities: string[] | null;

  @ApiProperty({ enum: PropertyStatus })
  @Column({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.DRAFT })
  status: PropertyStatus;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'contact_request_count', default: 0 })
  contactRequestCount: number;

  @Column({ name: 'year_built', type: 'smallint', nullable: true })
  yearBuilt: number | null;

  @Column({ type: 'enum', enum: PropertyCondition, nullable: true })
  condition: PropertyCondition | null;

  @Column({ name: 'heating_type', type: 'varchar', length: 100, nullable: true })
  heatingType: string | null;

  @Column({ name: 'cooling_type', type: 'varchar', length: 100, nullable: true })
  coolingType: string | null;

  @Column({ name: 'is_furnished', default: false })
  isFurnished: boolean;

  @Column({ name: 'has_elevator', default: false })
  hasElevator: boolean;

  @Column({ name: 'has_parking', default: false })
  hasParking: boolean;

  @Column({ name: 'has_terrace', default: false })
  hasTerrace: boolean;

  @Column({ name: 'has_garden', default: false })
  hasGarden: boolean;

  @Column({ name: 'energy_class', type: 'varchar', length: 1, nullable: true })
  energyClass: string | null;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PropertyMedia, (m) => m.property)
  media: PropertyMedia[];

  get pricePerSqm(): number {
    return Math.round(this.price / this.totalAreaSqm);
  }
}
