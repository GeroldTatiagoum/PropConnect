import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';
export declare enum MessageType {
    TEXT = "text",
    DOCUMENT_SHARE = "document_share",
    SYSTEM_NOTIFICATION = "system_notification",
    MEETING_PROPOSAL = "meeting_proposal"
}
export declare class Message {
    id: string;
    conversationId: string;
    conversation: Conversation;
    senderId: string;
    sender: User;
    recipientId: string;
    recipient: User;
    content: string;
    messageType: MessageType;
    metadata: Record<string, unknown> | null;
    isDeleted: boolean;
    readAt: Date | null;
    createdAt: Date;
}
//# sourceMappingURL=message.entity.d.ts.map