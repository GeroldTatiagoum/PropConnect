import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { DocumentType, DocumentSide } from '../../database/entities/document.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number, role?: UserRole): Promise<{
        data: User[];
        pagination: Record<string, number | boolean>;
    }>;
    getUserStats(): Promise<{
        total: number;
        active: number;
        byRole: Record<string, number>;
        byKyc: Record<string, number>;
    }>;
    adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User>;
    getMe(user: User): User;
    updateMe(user: User, dto: UpdateUserDto): Promise<User>;
    getKycStatus(user: User): Promise<{
        overallStatus: string;
        documents: import("../../database/entities/document.entity").Document[];
        lastReviewedAt: Date | null;
        expiresAt: Date | null;
    }>;
    uploadKycDocument(user: User, file: Express.Multer.File, documentType: DocumentType, side: DocumentSide): Promise<import("../../database/entities/document.entity").Document>;
}
//# sourceMappingURL=users.controller.d.ts.map