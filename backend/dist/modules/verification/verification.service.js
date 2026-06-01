"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const verification_entity_1 = require("./entities/verification.entity");
const user_entity_1 = require("../users/entities/user.entity");
const logger_service_1 = require("../../shared/services/logger.service");
const DEFAULT_KYC_CHECKLIST = [
    { id: 'id-doc', name: 'Identity Document', required: true },
    { id: 'selfie', name: 'Selfie with document', required: true },
    { id: 'address', name: 'Proof of address', required: false },
];
const DEFAULT_PROPERTY_CHECKLIST = [
    { id: 'cadastral', name: 'Cadastral Certificate', required: true },
    { id: 'ape', name: 'Energy Performance Certificate (APE)', required: true },
    { id: 'floor-plan', name: 'Floor Plan', required: false },
    { id: 'deed', name: 'Property Deed', required: true },
];
let VerificationService = class VerificationService {
    constructor(verificationRepo, userRepo, logger) {
        this.verificationRepo = verificationRepo;
        this.userRepo = userRepo;
        this.logger = logger;
    }
    async createKycVerification(userId) {
        const existing = await this.verificationRepo.findOne({
            where: {
                userId,
                verificationType: verification_entity_1.VerificationType.KYC_USER,
                status: verification_entity_1.VerificationStatus.PENDING,
            },
        });
        if (existing)
            return existing;
        const checklist = DEFAULT_KYC_CHECKLIST.map((item) => ({
            ...item,
            completed: false,
            notes: '',
        }));
        const verification = this.verificationRepo.create({
            userId,
            verificationType: verification_entity_1.VerificationType.KYC_USER,
            status: verification_entity_1.VerificationStatus.PENDING,
            priority: verification_entity_1.VerificationPriority.HIGH,
            checklist,
            expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        });
        return this.verificationRepo.save(verification);
    }
    async getQueue(brokerId, params) {
        const { status, page, limit } = params;
        const qb = this.verificationRepo
            .createQueryBuilder('v')
            .leftJoinAndSelect('v.user', 'u')
            .where('(v.assigned_broker_id IS NULL OR v.assigned_broker_id = :brokerId)', { brokerId });
        if (status)
            qb.andWhere('v.status = :status', { status });
        qb.orderBy('v.priority', 'DESC').addOrderBy('v.created_at', 'ASC');
        const total = await qb.getCount();
        const data = await qb.skip((page - 1) * limit).take(limit).getMany();
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async findById(id) {
        const v = await this.verificationRepo.findOne({
            where: { id },
            relations: ['user', 'assignedBroker'],
        });
        if (!v)
            throw new common_1.NotFoundException('Verification not found');
        return v;
    }
    async assignBroker(verificationId, brokerId) {
        const verification = await this.findById(verificationId);
        if (verification.status !== verification_entity_1.VerificationStatus.PENDING) {
            throw new common_1.BadRequestException('Verification is not pending');
        }
        verification.assignedBrokerId = brokerId;
        verification.assignedAt = new Date();
        verification.status = verification_entity_1.VerificationStatus.IN_REVIEW;
        return this.verificationRepo.save(verification);
    }
    async approve(id, brokerId, dto) {
        const verification = await this.findById(id);
        this.assertBrokerOwns(verification, brokerId);
        if (verification.checklist) {
            dto.completedItems.forEach((itemId) => {
                const item = verification.checklist.find((c) => c.id === itemId);
                if (item)
                    item.completed = true;
            });
        }
        verification.status = verification_entity_1.VerificationStatus.APPROVED;
        verification.completedBy = brokerId;
        verification.completedAt = new Date();
        verification.notes = dto.notes ?? null;
        const saved = await this.verificationRepo.save(verification);
        if (verification.userId) {
            await this.userRepo.update(verification.userId, { kycStatus: user_entity_1.KycStatus.APPROVED });
        }
        this.logger.log(`Verification ${id} approved by broker ${brokerId}`, 'VerificationService');
        this.logger.security({ event: 'verification_approved', verificationId: id, brokerId });
        return saved;
    }
    async reject(id, brokerId, dto) {
        const verification = await this.findById(id);
        this.assertBrokerOwns(verification, brokerId);
        verification.status = verification_entity_1.VerificationStatus.REJECTED;
        verification.rejectionReason = dto.reason;
        verification.rejectionDetails = {
            rejectedItems: dto.rejectedItems,
            requestedCorrections: dto.requestedCorrections ?? [],
        };
        verification.completedBy = brokerId;
        verification.completedAt = new Date();
        const saved = await this.verificationRepo.save(verification);
        if (verification.userId) {
            await this.userRepo.update(verification.userId, { kycStatus: user_entity_1.KycStatus.REJECTED });
        }
        this.logger.log(`Verification ${id} rejected by broker ${brokerId}`, 'VerificationService');
        return saved;
    }
    assertBrokerOwns(verification, brokerId) {
        if (verification.assignedBrokerId &&
            verification.assignedBrokerId !== brokerId) {
            throw new common_1.ForbiddenException('This verification is assigned to another broker');
        }
        if (verification.status !== verification_entity_1.VerificationStatus.PENDING &&
            verification.status !== verification_entity_1.VerificationStatus.IN_REVIEW) {
            throw new common_1.BadRequestException('Verification is already completed');
        }
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(verification_entity_1.Verification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        logger_service_1.LoggerService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map