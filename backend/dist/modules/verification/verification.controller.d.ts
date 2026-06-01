import { VerificationService } from './verification.service';
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { User } from '../users/entities/user.entity';
import { VerificationStatus } from './entities/verification.entity';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    getQueue(user: User, status?: VerificationStatus, page?: number, limit?: number): Promise<{
        data: import("./entities/verification.entity").Verification[];
        pagination: Record<string, number | boolean>;
    }>;
    findOne(id: string): Promise<import("./entities/verification.entity").Verification>;
    assign(id: string, user: User): Promise<import("./entities/verification.entity").Verification>;
    approve(id: string, user: User, dto: ApproveVerificationDto): Promise<import("./entities/verification.entity").Verification>;
    reject(id: string, user: User, dto: RejectVerificationDto): Promise<import("./entities/verification.entity").Verification>;
}
//# sourceMappingURL=verification.controller.d.ts.map