import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  Max,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType, PropertyCondition } from '../entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Via Roma 123, 20100 Milano' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;

  @ApiProperty({ example: 'Milano' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'MI' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  province: string;

  @ApiProperty({ example: 45.4642 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 9.19 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  @Max(100)
  roomsCount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathroomsCount?: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(1)
  totalAreaSqm: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  landAreaSqm?: number;

  @ApiProperty({ example: 450000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ required: false, enum: PropertyCondition })
  @IsOptional()
  @IsEnum(PropertyCondition)
  condition?: PropertyCondition;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  yearBuilt?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFurnished?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasTerrace?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasGarden?: boolean;

  @ApiProperty({ required: false, example: 'B' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  energyClass?: string;
}
