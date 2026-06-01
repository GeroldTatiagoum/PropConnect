import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import { LoggerService } from '../../shared/services/logger.service';
export declare class MessagingService {
    private readonly conversationRepo;
    private readonly messageRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(conversationRepo: Repository<Conversation>, messageRepo: Repository<Message>, userRepo: Repository<User>, logger: LoggerService);
    startConversation(buyerId: string, dto: StartConversationDto): Promise<Conversation>;
    getConversations(userId: string, params: {
        page: number;
        limit: number;
    }): Promise<{
        data: Conversation[];
        pagination: Record<string, number | boolean>;
    }>;
    getMessages(conversationId: string, userId: string, params: {
        page: number;
        limit: number;
    }): Promise<{
        data: Message[];
        pagination: Record<string, number | boolean>;
    }>;
    sendMessage(conversationId: string, senderId: string, dto: SendMessageDto): Promise<Message>;
    private addMessage;
    private findConversation;
    private markAsRead;
}
//# sourceMappingURL=messaging.service.d.ts.map