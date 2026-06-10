"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../services/logger.service");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor() {
        this.logger = new logger_service_1.LoggerService();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        let details = [];
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const body = exceptionResponse;
                message = body.message || exception.message;
                code = body.code || this.statusToCode(status);
                details = Array.isArray(body.errors)
                    ? body.errors
                    : [];
            }
            else {
                message = exceptionResponse;
                code = this.statusToCode(status);
            }
        }
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} → ${status}: ${message}`, exception instanceof Error ? exception.stack : undefined, 'HttpExceptionFilter');
        }
        else if (status >= 400) {
            this.logger.warn(`${request.method} ${request.url} → ${status} (${code}): ${message}`, 'HttpExceptionFilter');
        }
        response.status(status).json({
            error: {
                code,
                message,
                ...(details.length > 0 && { details }),
            },
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    statusToCode(status) {
        const map = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'VALIDATION_ERROR',
            429: 'RATE_LIMIT_EXCEEDED',
            500: 'INTERNAL_ERROR',
        };
        return map[status] ?? 'ERROR';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map