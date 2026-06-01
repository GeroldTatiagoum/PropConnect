import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { User } from './entities/user.entity';
import { Document, DocumentType, DocumentSide } from '../../database/entities/document.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../../shared/services/logger.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@Injectable()
export class UsersService {
  private readonly s3: AWS.S3;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.s3 = new AWS.S3({ region: config.get('AWS_REGION') });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async getKycStatus(userId: string): Promise<{
    overallStatus: string;
    documents: Document[];
    lastReviewedAt: Date | null;
    expiresAt: Date | null;
  }> {
    const user = await this.findById(userId);
    const documents = await this.documentRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const lastReviewed = documents.find((d) => d.verifiedAt)?.verifiedAt ?? null;
    const earliestExpiry = documents
      .filter((d) => d.expiresAt)
      .sort((a, b) => (a.expiresAt! < b.expiresAt! ? -1 : 1))[0]?.expiresAt ?? null;

    return {
      overallStatus: user.kycStatus,
      documents,
      lastReviewedAt: lastReviewed,
      expiresAt: earliestExpiry,
    };
  }

  async uploadKycDocument(
    userId: string,
    file: Express.Multer.File,
    documentType: DocumentType,
    side: DocumentSide,
  ): Promise<Document> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed. Use PDF, JPG or PNG.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File exceeds 10MB limit');
    }

    const bucket = this.config.getOrThrow<string>('AWS_S3_BUCKET');
    const s3Key = `kyc/${userId}/${documentType}_${side}_${Date.now()}`;

    await this.s3
      .putObject({
        Bucket: bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
        Metadata: { userId, documentType, side },
      })
      .promise();

    const document = this.documentRepo.create({
      userId,
      documentType,
      documentSide: side,
      s3Key,
      s3Path: `s3://${bucket}/${s3Key}`,
      fileSizeBytes: file.size,
      fileMimeType: file.mimetype,
    });

    const saved = await this.documentRepo.save(document);
    this.logger.log(`KYC document uploaded: ${saved.id} for user ${userId}`, 'UsersService');
    return saved;
  }

  async getPresignedDownloadUrl(s3Key: string): Promise<string> {
    const bucket = this.config.getOrThrow<string>('AWS_S3_BUCKET');
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: s3Key,
      Expires: 3600,
    });
  }
}
