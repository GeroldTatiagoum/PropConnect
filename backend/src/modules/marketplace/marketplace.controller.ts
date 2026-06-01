import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

class MarketOverviewQuery {
  @ApiProperty() @Type(() => Number) @IsNumber() latitude: number;
  @ApiProperty() @Type(() => Number) @IsNumber() longitude: number;
  @ApiProperty({ default: 5 }) @Type(() => Number) @IsNumber() radius: number = 5;
  @ApiProperty({ required: false }) @IsOptional() @IsString() propertyType?: string;
}

class ComparablesQuery {
  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number) @IsOptional() @IsNumber() maxResults?: number;
  @ApiProperty({ required: false, default: 0.8 })
  @Type(() => Number) @IsOptional() @IsNumber() similarity?: number;
}

@ApiTags('Marketplace')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get market data overview for a zone' })
  @ApiResponse({ status: 200, description: 'Market data summary' })
  getOverview(@Query() query: MarketOverviewQuery) {
    return this.marketplaceService.getMarketOverview({
      latitude: query.latitude,
      longitude: query.longitude,
      radius: query.radius,
      propertyType: query.propertyType,
    });
  }

  @Get('valuations/:propertyId')
  @ApiOperation({ summary: 'Get AI-powered property valuation' })
  @ApiParam({ name: 'propertyId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Property valuation' })
  getValuation(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.marketplaceService.getOrComputeValuation(propertyId);
  }

  @Get('comparables')
  @ApiOperation({ summary: 'Get comparable properties' })
  @ApiResponse({ status: 200, description: 'Comparable properties list' })
  getComparables(
    @Query('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() query: ComparablesQuery,
  ) {
    return this.marketplaceService.getComparables(
      propertyId,
      query.maxResults,
      query.similarity,
    );
  }
}
