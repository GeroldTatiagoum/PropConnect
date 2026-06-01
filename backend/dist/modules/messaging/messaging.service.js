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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const user_entity_1 = require("../users/entities/user.entity");
const logger_service_1 = require("../../shared/services/logger.service");
let MessagingService = class MessagingService {
    constructor(conversationRepo, messageRepo, userRepo, logger) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.logger = logger;
    }
    async startConversation(buyerId, dto) {
        const buyer = await this.userRepo.findOneOrFail({ where: { id: buyerId } });
        if (buyer.kycStatus !== user_entity_1.KycStatus.APPROVED) {
            throw new common_1.ForbiddenException('KYC verification required to initiate conversations');
        }
        if (buyerId === dto.sellerId) {
            throw new common_1.BadRequestException('Cannot start a conversation with yourself');
        }
        let conversation = await this.conversationRepo.findOne({
            where: { propertyId: dto.propertyId, buyerId },
        });
        if (!conversation) {
            conversation = this.conversationRepo.create({
                propertyId: dto.propertyId,
                buyerId,
                sellerId: dto.sellerId,
                status: conversation_entity_1.ConversationStatus.ACTIVE,
            });
            conversation = await this.conversationRepo.save(conversation);
        }
        await this.addMessage(conversation.id, buyerId, dto.sellerId, dto.message);
        return conversation;
    }
    async getConversations(userId, params) {
        const { page, limit } = params;
        const qb = this.conversationRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.buyer', 'buyer')
            .leftJoinAndSelect('c.seller', 'seller')
            .where('(c.buyer_id = :uid OR c.seller_id = :uid)', { uid: userId })
            .andWhere('c.status != :blocked', { blocked: conversation_entity_1.ConversationStatus.BLOCKED })
            .orderBy('c.last_message_at', 'DESC', 'NULLS LAST');
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
    async getMessages(conversationId, userId, params) {
        const conversation = await this.findConversation(conversationId, userId);
        const { page, limit } = params;
        const [data, total] = await this.messageRepo.findAndCount({
            where: { conversationId: conversation.id, isDeleted: false },
            order: { createdAt: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['sender'],
        });
        await this.markAsRead(conversationId, userId);
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
    async sendMessage(conversationId, senderId, dto) {
        const conversation = await this.findConversation(conversationId, senderId);
        const recipientId = conversation.buyerId === senderId
            ? conversation.sellerId
            : conversation.buyerId;
        return this.addMessage(conversationId, senderId, recipientId, dto.content, dto.type);
    }
    async addMessage(conversationId, senderId, recipientId, content, type = message_entity_1.MessageType.TEXT) {
        const message = this.messageRepo.create({
            conversationId,
            senderId,
            recipientId,
            content,
            messageType: type,
        });
        const saved = await this.messageRepo.save(message);
        await this.conversationRepo.update(conversationId, {
            lastMessageAt: saved.createdAt,
        });
        return saved;
    }
    async findConversation(id, userId) {
        const conversation = await this.conversationRepo.findOne({ where: { id } });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        if (conversation.buyerId !== userId &&
            conversation.sellerId !== userId) {
            throw new common_1.ForbiddenException('Access denied to this conversation');
        }
        return conversation;
    }
    async markAsRead(conversationId, userId) {
        await this.messageRepo
            .createQueryBuilder()
            .update()
            .set({ readAt: new Date() })
            .where('conversation_id = :conversationId', { conversationId })
            .andWhere('recipient_id = :userId', { userId })
            .andWhere('read_at IS NULL')
            .execute();
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        logger_service_1.LoggerService])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map