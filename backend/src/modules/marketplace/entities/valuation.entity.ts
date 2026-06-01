import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('valuations')
@Index('idx_valuations_property', ['propertyId'])
export class Valuation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', unique: true })
  propertyId: string;

  @OneToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'estimated_value', type: 'decimal', precision: 15, scale: 2 })
  estimatedValue: number;

  @Column({ name: 'value_range_low', type: 'decimal', precision: 15, scale: 2, nullable: true })
  valueRangeLow: number | null;

  @Column({ name: 'value_range_high', type: 'decimal', precision: 15, scale: 2, nullable: true })
  valueRangeHigh: number | null;

  @Column({ name: 'confidence_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidenceScore: number | null;

  @Column({ type: 'jsonb', nullable: true })
  factors: Record<string, number> | null;

  @Column({ name: 'algorithm_version', type: 'varchar', length: 10, nullable: true })
  algorithmVersion: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
