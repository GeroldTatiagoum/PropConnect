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
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UserRole } from './entities/user.entity';
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
    this.logger.debug(`findById: userId=${id}`, 'UsersService');
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`findById not found: userId=${id}`, 'UsersService');
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(
    filters: { role?: UserRole },
    page = 1,
    limit = 20,
  ): Promise<{ data: User[]; pagination: Record<string, number | boolean> }> {
    this.logger.debug(`findAll: role=${filters.role ?? 'all'} page=${page} limit=${limit}`, 'UsersService');
    const qb = this.userRepo.createQueryBuilder('u').where('1=1');
    if (filters.role) qb.andWhere('u.role = :role', { role: filters.role });
    qb.orderBy('u.created_at', 'DESC');
    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    this.logger.debug(`findAll result: total=${total} returned=${data.length}`, 'UsersService');
    const pages = Math.ceil(total / limit);
    return { data, pagination: { total, page, limit, pages, hasNext: page < pages, hasPrev: page > 1 } };
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    byRole: Record<string, number>;
    byKyc: Record<string, number>;
  }> {
    const total = await this.userRepo.count();
    const active = await this.userRepo.count({ where: { isActive: true } });
    const byRoleRaw = await this.userRepo
      .createQueryBuilder('u')
      .select('u.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.role')
      .getRawMany();
    const byKycRaw = await this.userRepo
      .createQueryBuilder('u')
      .select('u.kyc_status', 'kycStatus')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.kyc_status')
      .getRawMany();
    return {
      total,
      active,
      byRole: Object.fromEntries(byRoleRaw.map((r) => [r.role, Number(r.count)])),
      byKyc: Object.fromEntries(byKycRaw.map((r) => [r.kycStatus, Number(r.count)])),
    };
  }

  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User> {
    this.logger.debug(`adminUpdate: userId=${id} fields=${Object.keys(dto).join(',')}`, 'UsersService');
    const user = await this.findById(id);
    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    this.logger.log(`adminUpdate success: userId=${id} role=${saved.role} isActive=${saved.isActive} kycStatus=${saved.kycStatus}`, 'UsersService');
    return saved;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    this.logger.debug(`update: userId=${userId} fields=${Object.keys(dto).join(',')}`, 'UsersService');
    const user = await this.findById(userId);
    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    this.logger.log(`update success: userId=${userId}`, 'UsersService');
    return saved;
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
    this.logger.debug(`uploadKycDocument: userId=${userId} type=${documentType} side=${side} mime=${file.mimetype} size=${file.size}`, 'UsersService');

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      this.logger.warn(`uploadKycDocument rejected: userId=${userId} reason=invalid_mime mime=${file.mimetype}`, 'UsersService');
      throw new BadRequestException('File type not allowed. Use PDF, JPG or PNG.');
    }

    if (file.size > MAX_FILE_SIZE) {
      this.logger.warn(`uploadKycDocument rejected: userId=${userId} reason=file_too_large size=${file.size}`, 'UsersService');
      throw new BadRequestException('File exceeds 10MB limit');
    }

    const bucket = this.config.getOrThrow<string>('AWS_S3_BUCKET');
    const s3Key = `kyc/${userId}/${documentType}_${side}_${Date.now()}`;
    this.logger.debug(`uploadKycDocument: uploading to S3 bucket=${bucket} key=${s3Key}`, 'UsersService');

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
    this.logger.log(`uploadKycDocument success: documentId=${saved.id} userId=${userId} type=${documentType} side=${side}`, 'UsersService');
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
