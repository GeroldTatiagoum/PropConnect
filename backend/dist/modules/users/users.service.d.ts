import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Document, DocumentType, DocumentSide } from '../../database/entities/document.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../../shared/services/logger.service';
export declare class UsersService {
    private readonly userRepo;
    private readonly documentRepo;
    private readonly config;
    private readonly logger;
    private readonly s3;
    constructor(userRepo: Repository<User>, documentRepo: Repository<Document>, config: ConfigService, logger: LoggerService);
    findById(id: string): Promise<User>;
    update(userId: string, dto: UpdateUserDto): Promise<User>;
    getKycStatus(userId: string): Promise<{
        overallStatus: string;
        documents: Document[];
        lastReviewedAt: Date | null;
        expiresAt: Date | null;
    }>;
    uploadKycDocument(userId: string, file: Express.Multer.File, documentType: DocumentType, side: DocumentSide): Promise<Document>;
    getPresignedDownloadUrl(s3Key: string): Promise<string>;
}
//# sourceMappingURL=users.service.d.ts.map