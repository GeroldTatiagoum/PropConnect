import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole.SELLER | UserRole.BUYER;
    phone?: string;
}
//# sourceMappingURL=register.dto.d.ts.map