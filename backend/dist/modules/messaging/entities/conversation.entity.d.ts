import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';
export declare enum ConversationStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    BLOCKED = "blocked"
}
export declare class Conversation {
    id: string;
    propertyId: string;
    buyerId: string;
    buyer: User;
    sellerId: string;
    seller: User;
    status: ConversationStatus;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}
//# sourceMappingURL=conversation.entity.d.ts.map