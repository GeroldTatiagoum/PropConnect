import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('market_data')
@Index('idx_market_data_zone', ['zoneName'])
@Index('idx_market_data_date', ['dateRecorded'])
@Index('idx_market_data_type', ['propertyType'])
@Unique('unique_market_data', ['zoneName', 'propertyType', 'dateRecorded'])
export class MarketData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'zone_name', length: 255 })
  zoneName: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'property_type', length: 100 })
  propertyType: string;

  @Column({ name: 'date_recorded', type: 'date' })
  dateRecorded: string;

  @Column({ name: 'avg_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgPricePerSqm: number | null;

  @Column({ name: 'min_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minPricePerSqm: number | null;

  @Column({ name: 'max_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxPricePerSqm: number | null;

  @Column({ name: 'avg_days_to_sale', type: 'int', nullable: true })
  avgDaysToSale: number | null;

  @Column({ name: 'active_listings_count', type: 'int', nullable: true })
  activeListingsCount: number | null;

  @Column({ name: 'sold_count_last_30_days', type: 'int', nullable: true })
  soldCountLast30Days: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
