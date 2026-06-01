import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { VerificationStatus } from './entities/verification.entity';

@ApiTags('Verification')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('queue')
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get verification queue (broker)' })
  @ApiResponse({ status: 200, description: 'Paginated verification queue' })
  getQueue(
    @CurrentUser() user: User,
    @Query('status') status?: VerificationStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.verificationService.getQueue(user.id, {
      status,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get verification details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationService.findById(id);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Self-assign a verification task' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  assign(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.verificationService.assignBroker(id, user.id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a verification' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Verification approved' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: ApproveVerificationDto,
  ) {
    return this.verificationService.approve(id, user.id, dto);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject a verification with correction requests' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Verification rejected' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: RejectVerificationDto,
  ) {
    return this.verificationService.reject(id, user.id, dto);
  }
}
