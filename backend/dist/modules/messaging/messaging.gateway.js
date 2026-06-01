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
exports.MessagingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const messaging_service_1 = require("./messaging.service");
const logger_service_1 = require("../../shared/services/logger.service");
let MessagingGateway = class MessagingGateway {
    constructor(messagingService, jwtService, config, logger) {
        this.messagingService = messagingService;
        this.jwtService = jwtService;
        this.config = config;
        this.logger = logger;
        this.connectedUsers = new Map(); // userId → socketId
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth['token'] ??
                client.handshake.headers['authorization']?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.config.getOrThrow('JWT_SECRET'),
            });
            client.userId = payload.sub;
            this.connectedUsers.set(payload.sub, client.id);
            this.logger.log(`WS connected: ${payload.sub}`, 'MessagingGateway');
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.connectedUsers.delete(client.userId);
            this.logger.log(`WS disconnected: ${client.userId}`, 'MessagingGateway');
        }
    }
    handleJoinConversation(data, client) {
        void client.join(`conversation:${data.conversationId}`);
    }
    handleLeaveConversation(data, client) {
        void client.leave(`conversation:${data.conversationId}`);
    }
    async handleSendMessage(data, client) {
        if (!client.userId)
            return;
        const message = await this.messagingService.sendMessage(data.conversationId, client.userId, { content: data.content, type: data.type });
        this.server
            .to(`conversation:${data.conversationId}`)
            .emit('new_message', message);
    }
    emitToUser(userId, event, payload) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.server.to(socketId).emit(event, payload);
        }
    }
};
exports.MessagingGateway = MessagingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MessagingGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MessagingGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleSendMessage", null);
exports.MessagingGateway = MessagingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true },
        namespace: '/messaging',
    }),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService,
        jwt_1.JwtService,
        config_1.ConfigService,
        logger_service_1.LoggerService])
], MessagingGateway);
//# sourceMappingURL=messaging.gateway.js.map