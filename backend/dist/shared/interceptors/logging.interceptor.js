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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const logger_service_1 = require("../services/logger.service");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url, ip, body, query } = req;
        const userAgent = req.get('user-agent') ?? '-';
        const startTime = Date.now();
        const userId = req.user?.id ?? 'anonymous';
        const role = req.user?.role ?? '-';
        const queryStr = Object.keys(query).length ? ` query=${JSON.stringify(query)}` : '';
        const bodySize = req.get('content-length') ?? '0';
        this.logger.debug(`→ ${method} ${url} user=${userId} role=${role} ip=${ip} ua="${userAgent}"${queryStr} body=${bodySize}b`, 'HTTP');
        return next.handle().pipe((0, operators_1.tap)(() => {
            const res = context.switchToHttp().getResponse();
            const durationMs = Date.now() - startTime;
            const { statusCode } = res;
            if (statusCode >= 400) {
                this.logger.warn(`← ${method} ${url} ${statusCode} ${durationMs}ms user=${userId}`, 'HTTP');
            }
            else {
                this.logger.log(`← ${method} ${url} ${statusCode} ${durationMs}ms user=${userId}`, 'HTTP');
            }
        }), (0, operators_1.catchError)((err) => {
            const durationMs = Date.now() - startTime;
            this.logger.warn(`← ${method} ${url} ERROR ${durationMs}ms user=${userId}: ${err.message}`, 'HTTP');
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map