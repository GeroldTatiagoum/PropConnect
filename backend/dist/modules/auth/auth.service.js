"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../users/entities/user.entity");
const redis_service_1 = require("../../shared/services/redis.service");
const logger_service_1 = require("../../shared/services/logger.service");
const REFRESH_TOKEN_PREFIX = 'refresh:';
const BCRYPT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(userRepo, jwtService, config, redis, logger) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.config = config;
        this.redis = redis;
        this.logger = logger;
    }
    async register(dto) {
        this.logger.debug(`register attempt: email=${dto.email} role=${dto.role ?? user_entity_1.UserRole.BUYER}`, 'AuthService');
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            this.logger.warn(`register rejected: email=${dto.email} reason=already_registered`, 'AuthService');
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = this.userRepo.create({
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role ?? user_entity_1.UserRole.BUYER,
            phone: dto.phone ?? null,
            kycStatus: user_entity_1.KycStatus.PENDING,
        });
        await this.userRepo.save(user);
        this.logger.log(`register success: userId=${user.id} email=${user.email} role=${user.role}`, 'AuthService');
        const tokens = await this.generateTokens(user);
        return { user, ...tokens };
    }
    async login(dto, ip) {
        this.logger.debug(`login attempt: email=${dto.email} ip=${ip}`, 'AuthService');
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user || !user.isActive) {
            this.logger.security({ event: 'login_failed', email: dto.email, ip, reason: 'user_not_found_or_inactive' });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            this.logger.security({ event: 'login_failed', userId: user.id, ip, reason: 'bad_password' });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLoginAt = new Date();
        await this.userRepo.save(user);
        this.logger.security({ event: 'login_success', userId: user.id, role: user.role, ip });
        this.logger.log(`login success: userId=${user.id} role=${user.role}`, 'AuthService');
        const tokens = await this.generateTokens(user);
        return { user, ...tokens };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch (err) {
            this.logger.warn(`token refresh failed: reason=invalid_jwt err=${err.message}`, 'AuthService');
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const stored = await this.redis.get(`${REFRESH_TOKEN_PREFIX}${payload.sub}`);
        if (!stored || stored !== refreshToken) {
            this.logger.security({ event: 'refresh_token_reuse', userId: payload.sub, reason: 'token_not_in_store' });
            throw new common_1.UnauthorizedException('Refresh token revoked or expired');
        }
        const user = await this.userRepo.findOne({ where: { id: payload.sub, isActive: true } });
        if (!user) {
            this.logger.warn(`token refresh failed: userId=${payload.sub} reason=user_not_found`, 'AuthService');
            throw new common_1.UnauthorizedException('User not found');
        }
        const accessToken = this.signAccessToken(user);
        const expiresIn = 900;
        this.logger.debug(`token refreshed: userId=${user.id}`, 'AuthService');
        return { accessToken, expiresIn, tokenType: 'Bearer' };
    }
    async logout(userId) {
        await this.redis.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
        this.logger.log(`logout: userId=${userId}`, 'AuthService');
        this.logger.security({ event: 'logout', userId });
    }
    async generateTokens(user) {
        const accessToken = this.signAccessToken(user);
        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: 30 * 24 * 3600, // 30 days in seconds
        });
        const refreshTtlDays = 30;
        await this.redis.set(`${REFRESH_TOKEN_PREFIX}${user.id}`, refreshToken, refreshTtlDays * 24 * 3600);
        return { accessToken, refreshToken, expiresIn: 900 };
    }
    signAccessToken(user) {
        return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, {
            secret: this.config.getOrThrow('JWT_SECRET'),
            expiresIn: 900, // 15 minutes in seconds
            issuer: 'propconnect',
            audience: 'propconnect-api',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService,
        logger_service_1.LoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map