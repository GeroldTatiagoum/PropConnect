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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const AWS = __importStar(require("aws-sdk"));
const user_entity_1 = require("./entities/user.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const logger_service_1 = require("../../shared/services/logger.service");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
let UsersService = class UsersService {
    constructor(userRepo, documentRepo, config, logger) {
        this.userRepo = userRepo;
        this.documentRepo = documentRepo;
        this.config = config;
        this.logger = logger;
        this.s3 = new AWS.S3({ region: config.get('AWS_REGION') });
    }
    async findById(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(userId, dto) {
        const user = await this.findById(userId);
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }
    async getKycStatus(userId) {
        const user = await this.findById(userId);
        const documents = await this.documentRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const lastReviewed = documents.find((d) => d.verifiedAt)?.verifiedAt ?? null;
        const earliestExpiry = documents
            .filter((d) => d.expiresAt)
            .sort((a, b) => (a.expiresAt < b.expiresAt ? -1 : 1))[0]?.expiresAt ?? null;
        return {
            overallStatus: user.kycStatus,
            documents,
            lastReviewedAt: lastReviewed,
            expiresAt: earliestExpiry,
        };
    }
    async uploadKycDocument(userId, file, documentType, side) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('File type not allowed. Use PDF, JPG or PNG.');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException('File exceeds 10MB limit');
        }
        const bucket = this.config.getOrThrow('AWS_S3_BUCKET');
        const s3Key = `kyc/${userId}/${documentType}_${side}_${Date.now()}`;
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
        this.logger.log(`KYC document uploaded: ${saved.id} for user ${userId}`, 'UsersService');
        return saved;
    }
    async getPresignedDownloadUrl(s3Key) {
        const bucket = this.config.getOrThrow('AWS_S3_BUCKET');
        return this.s3.getSignedUrlPromise('getObject', {
            Bucket: bucket,
            Key: s3Key,
            Expires: 3600,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        logger_service_1.LoggerService])
], UsersService);
//# sourceMappingURL=users.service.js.map