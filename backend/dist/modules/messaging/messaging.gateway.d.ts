import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/send-message.dto';
import { LoggerService } from '../../shared/services/logger.service';
interface AuthenticatedSocket extends Socket {
    userId: string;
}
export declare class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagingService;
    private readonly jwtService;
    private readonly config;
    private readonly logger;
    server: Server;
    private readonly connectedUsers;
    constructor(messagingService: MessagingService, jwtService: JwtService, config: ConfigService, logger: LoggerService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinConversation(data: {
        conversationId: string;
    }, client: AuthenticatedSocket): void;
    handleLeaveConversation(data: {
        conversationId: string;
    }, client: AuthenticatedSocket): void;
    handleSendMessage(data: {
        conversationId: string;
    } & SendMessageDto, client: AuthenticatedSocket): Promise<void>;
    emitToUser(userId: string, event: string, payload: unknown): void;
}
export {};
//# sourceMappingURL=messaging.gateway.d.ts.map