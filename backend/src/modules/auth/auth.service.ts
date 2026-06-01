import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, KycStatus } from '../users/entities/user.entity';
import { RedisService } from '../../shared/services/redis.service';
import { LoggerService } from '../../shared/services/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_TOKEN_PREFIX = 'refresh:';
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async register(dto: RegisterDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? UserRole.BUYER,
      phone: dto.phone ?? null,
      kycStatus: KycStatus.PENDING,
    });

    await this.userRepo.save(user);
    this.logger.log(`User registered: ${user.id}`, 'AuthService');

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async login(dto: LoginDto, ip: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      this.logger.security({ event: 'login_failed', email: dto.email, ip, reason: 'user_not_found' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      this.logger.security({ event: 'login_failed', userId: user.id, ip, reason: 'bad_password' });
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    this.logger.security({ event: 'login_success', userId: user.id, ip });

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  }> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.redis.get(`${REFRESH_TOKEN_PREFIX}${payload.sub}`);
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub, isActive: true } });
    if (!user) throw new UnauthorizedException('User not found');

    const accessToken = this.signAccessToken(user);
    const expiresIn = 900;

    return { accessToken, expiresIn, tokenType: 'Bearer' };
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
    this.logger.log(`User logged out: ${userId}`, 'AuthService');
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const accessToken = this.signAccessToken(user);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: 30 * 24 * 3600, // 30 days in seconds
      },
    );

    const refreshTtlDays = 30;
    await this.redis.set(
      `${REFRESH_TOKEN_PREFIX}${user.id}`,
      refreshToken,
      refreshTtlDays * 24 * 3600,
    );

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  private signAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: 900, // 15 minutes in seconds
        issuer: 'propconnect',
        audience: 'propconnect-api',
      },
    );
  }
}
