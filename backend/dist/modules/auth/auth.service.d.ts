import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { RedisService } from '../../shared/services/redis.service';
import { LoggerService } from '../../shared/services/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly config;
    private readonly redis;
    private readonly logger;
    constructor(userRepo: Repository<User>, jwtService: JwtService, config: ConfigService, redis: RedisService, logger: LoggerService);
    register(dto: RegisterDto): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    login(dto: LoginDto, ip: string): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        expiresIn: number;
        tokenType: string;
    }>;
    logout(userId: string): Promise<void>;
    private generateTokens;
    private signAccessToken;
}
//# sourceMappingURL=auth.service.d.ts.map