import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseEnumPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { DocumentType, DocumentSide } from '../../database/entities/document.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, type: User })
  getMe(@CurrentUser() user: User): User {
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, type: User })
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(user.id, dto);
  }

  @Get('kyc/status')
  @ApiOperation({ summary: 'Get KYC verification status' })
  getKycStatus(@CurrentUser() user: User) {
    return this.usersService.getKycStatus(user.id);
  }

  @Post('kyc/documents')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        documentType: { type: 'string', enum: Object.values(DocumentType) },
        side: { type: 'string', enum: Object.values(DocumentSide) },
      },
    },
  })
  @ApiOperation({ summary: 'Upload KYC document for verification' })
  uploadKycDocument(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Query('documentType', new ParseEnumPipe(DocumentType)) documentType: DocumentType,
    @Query('side', new ParseEnumPipe(DocumentSide)) side: DocumentSide,
  ) {
    return this.usersService.uploadKycDocument(user.id, file, documentType, side);
  }
}
