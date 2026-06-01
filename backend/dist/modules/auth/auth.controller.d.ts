import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../users/entities/user.entity").UserRole;
        kycStatus: import("../users/entities/user.entity").KycStatus;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    login(dto: LoginDto, req: Request): Promise<{
        id: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        expiresIn: number;
        tokenType: string;
    }>;
    logout(user: User): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map