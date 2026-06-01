import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from './entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import { User, KycStatus } from '../users/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async startConversation(
    buyerId: string,
    dto: StartConversationDto,
  ): Promise<Conversation> {
    const buyer = await this.userRepo.findOneOrFail({ where: { id: buyerId } });

    if (buyer.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required to initiate conversations');
    }

    if (buyerId === dto.sellerId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    let conversation = await this.conversationRepo.findOne({
      where: { propertyId: dto.propertyId, buyerId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        propertyId: dto.propertyId,
        buyerId,
        sellerId: dto.sellerId,
        status: ConversationStatus.ACTIVE,
      });
      conversation = await this.conversationRepo.save(conversation);
    }

    await this.addMessage(conversation.id, buyerId, dto.sellerId, dto.message);
    return conversation;
  }

  async getConversations(
    userId: string,
    params: { page: number; limit: number },
  ): Promise<{ data: Conversation[]; pagination: Record<string, number | boolean> }> {
    const { page, limit } = params;

    const qb = this.conversationRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.buyer', 'buyer')
      .leftJoinAndSelect('c.seller', 'seller')
      .where('(c.buyer_id = :uid OR c.seller_id = :uid)', { uid: userId })
      .andWhere('c.status != :blocked', { blocked: ConversationStatus.BLOCKED })
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

  async getMessages(
    conversationId: string,
    userId: string,
    params: { page: number; limit: number },
  ): Promise<{ data: Message[]; pagination: Record<string, number | boolean> }> {
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

  async sendMessage(
    conversationId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<Message> {
    const conversation = await this.findConversation(conversationId, senderId);

    const recipientId =
      conversation.buyerId === senderId
        ? conversation.sellerId
        : conversation.buyerId;

    return this.addMessage(
      conversationId,
      senderId,
      recipientId,
      dto.content,
      dto.type,
    );
  }

  private async addMessage(
    conversationId: string,
    senderId: string,
    recipientId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
  ): Promise<Message> {
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

  private async findConversation(
    id: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({ where: { id } });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (
      conversation.buyerId !== userId &&
      conversation.sellerId !== userId
    ) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    return conversation;
  }

  private async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepo
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where('conversation_id = :conversationId', { conversationId })
      .andWhere('recipient_id = :userId', { userId })
      .andWhere('read_at IS NULL')
      .execute();
  }
}
