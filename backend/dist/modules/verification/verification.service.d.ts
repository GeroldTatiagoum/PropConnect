import { Repository } from 'typeorm';
import { Verification, VerificationStatus } from './entities/verification.entity';
import { User } from '../users/entities/user.entity';
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { LoggerService } from '../../shared/services/logger.service';
export declare class VerificationService {
    private readonly verificationRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(verificationRepo: Repository<Verification>, userRepo: Repository<User>, logger: LoggerService);
    createKycVerification(userId: string): Promise<Verification>;
    getQueue(brokerId: string, params: {
        status?: VerificationStatus;
        page: number;
        limit: number;
    }): Promise<{
        data: Verification[];
        pagination: Record<string, number | boolean>;
    }>;
    findById(id: string): Promise<Verification>;
    assignBroker(verificationId: string, brokerId: string): Promise<Verification>;
    approve(id: string, brokerId: string, dto: ApproveVerificationDto): Promise<Verification>;
    reject(id: string, brokerId: string, dto: RejectVerificationDto): Promise<Verification>;
    private assertBrokerOwns;
}
//# sourceMappingURL=verification.service.d.ts.map