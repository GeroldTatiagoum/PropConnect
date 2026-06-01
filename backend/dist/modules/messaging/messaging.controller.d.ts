import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import { User } from '../users/entities/user.entity';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
    startConversation(user: User, dto: StartConversationDto): Promise<import("./entities/conversation.entity").Conversation>;
    getConversations(user: User, page?: number, limit?: number): Promise<{
        data: import("./entities/conversation.entity").Conversation[];
        pagination: Record<string, number | boolean>;
    }>;
    getMessages(conversationId: string, user: User, page?: number, limit?: number): Promise<{
        data: import("./entities/message.entity").Message[];
        pagination: Record<string, number | boolean>;
    }>;
    sendMessage(conversationId: string, user: User, dto: SendMessageDto): Promise<import("./entities/message.entity").Message>;
}
//# sourceMappingURL=messaging.controller.d.ts.map