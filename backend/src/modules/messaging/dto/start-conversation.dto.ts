import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiProperty({ description: 'Property UUID' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Seller UUID' })
  @IsUUID()
  sellerId: string;

  @ApiProperty({ description: 'Initial message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
