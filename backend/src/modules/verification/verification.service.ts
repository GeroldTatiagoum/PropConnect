import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Verification,
  VerificationStatus,
  VerificationType,
  VerificationPriority,
  ChecklistItem,
} from './entities/verification.entity';
import { User, UserRole, KycStatus } from '../users/entities/user.entity';
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { LoggerService } from '../../shared/services/logger.service';

const DEFAULT_KYC_CHECKLIST: Omit<ChecklistItem, 'completed' | 'notes'>[] = [
  { id: 'id-doc', name: 'Identity Document', required: true },
  { id: 'selfie', name: 'Selfie with document', required: true },
  { id: 'address', name: 'Proof of address', required: false },
];

const DEFAULT_PROPERTY_CHECKLIST: Omit<ChecklistItem, 'completed' | 'notes'>[] = [
  { id: 'cadastral', name: 'Cadastral Certificate', required: true },
  { id: 'ape', name: 'Energy Performance Certificate (APE)', required: true },
  { id: 'floor-plan', name: 'Floor Plan', required: false },
  { id: 'deed', name: 'Property Deed', required: true },
];

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepo: Repository<Verification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async createKycVerification(userId: string): Promise<Verification> {
    const existing = await this.verificationRepo.findOne({
      where: {
        userId,
        verificationType: VerificationType.KYC_USER,
        status: VerificationStatus.PENDING,
      },
    });
    if (existing) return existing;

    const checklist: ChecklistItem[] = DEFAULT_KYC_CHECKLIST.map((item) => ({
      ...item,
      completed: false,
      notes: '',
    }));

    const verification = this.verificationRepo.create({
      userId,
      verificationType: VerificationType.KYC_USER,
      status: VerificationStatus.PENDING,
      priority: VerificationPriority.HIGH,
      checklist,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return this.verificationRepo.save(verification);
  }

  async getQueue(
    brokerId: string,
    params: { status?: VerificationStatus; page: number; limit: number },
  ): Promise<{ data: Verification[]; pagination: Record<string, number | boolean> }> {
    const { status, page, limit } = params;

    const qb = this.verificationRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.user', 'u')
      .where('(v.assigned_broker_id IS NULL OR v.assigned_broker_id = :brokerId)', { brokerId });

    if (status) qb.andWhere('v.status = :status', { status });

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

  async findById(id: string): Promise<Verification> {
    const v = await this.verificationRepo.findOne({
      where: { id },
      relations: ['user', 'assignedBroker'],
    });
    if (!v) throw new NotFoundException('Verification not found');
    return v;
  }

  async assignBroker(verificationId: string, brokerId: string): Promise<Verification> {
    const verification = await this.findById(verificationId);

    if (verification.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('Verification is not pending');
    }

    verification.assignedBrokerId = brokerId;
    verification.assignedAt = new Date();
    verification.status = VerificationStatus.IN_REVIEW;

    return this.verificationRepo.save(verification);
  }

  async approve(
    id: string,
    brokerId: string,
    dto: ApproveVerificationDto,
  ): Promise<Verification> {
    const verification = await this.findById(id);
    this.assertBrokerOwns(verification, brokerId);

    if (verification.checklist) {
      dto.completedItems.forEach((itemId) => {
        const item = verification.checklist!.find((c) => c.id === itemId);
        if (item) item.completed = true;
      });
    }

    verification.status = VerificationStatus.APPROVED;
    verification.completedBy = brokerId;
    verification.completedAt = new Date();
    verification.notes = dto.notes ?? null;

    const saved = await this.verificationRepo.save(verification);

    if (verification.userId) {
      await this.userRepo.update(verification.userId, { kycStatus: KycStatus.APPROVED });
    }

    this.logger.log(`Verification ${id} approved by broker ${brokerId}`, 'VerificationService');
    this.logger.security({ event: 'verification_approved', verificationId: id, brokerId });

    return saved;
  }

  async reject(
    id: string,
    brokerId: string,
    dto: RejectVerificationDto,
  ): Promise<Verification> {
    const verification = await this.findById(id);
    this.assertBrokerOwns(verification, brokerId);

    verification.status = VerificationStatus.REJECTED;
    verification.rejectionReason = dto.reason;
    verification.rejectionDetails = {
      rejectedItems: dto.rejectedItems,
      requestedCorrections: dto.requestedCorrections ?? [],
    };
    verification.completedBy = brokerId;
    verification.completedAt = new Date();

    const saved = await this.verificationRepo.save(verification);

    if (verification.userId) {
      await this.userRepo.update(verification.userId, { kycStatus: KycStatus.REJECTED });
    }

    this.logger.log(`Verification ${id} rejected by broker ${brokerId}`, 'VerificationService');
    return saved;
  }

  private assertBrokerOwns(verification: Verification, brokerId: string): void {
    if (
      verification.assignedBrokerId &&
      verification.assignedBrokerId !== brokerId
    ) {
      throw new ForbiddenException('This verification is assigned to another broker');
    }

    if (
      verification.status !== VerificationStatus.PENDING &&
      verification.status !== VerificationStatus.IN_REVIEW
    ) {
      throw new BadRequestException('Verification is already completed');
    }
  }
}
