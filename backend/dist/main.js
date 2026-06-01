"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const logger_service_1 = require("./shared/services/logger.service");
async function bootstrap() {
    const logger = new logger_service_1.LoggerService();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger });
    // Security middleware
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    // CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    // Global validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
            const messages = errors.map((err) => `${err.property}: ${Object.values(err.constraints ?? {}).join(', ')}`);
            return new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: messages,
            });
        },
    }));
    // Global exception filter
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // API prefix
    app.setGlobalPrefix('api');
    // Swagger — disabled in production via env
    if (process.env.API_DOCS_ENABLED !== 'false') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('PropConnect API')
            .setDescription('PropConnect — Digital Real Estate Platform API\n\nBase URL: `https://api.propconnect.it/api`')
            .setVersion('1.0.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
            .addTag('Authentication', 'User registration, login and token management')
            .addTag('Users', 'User profiles and KYC document upload')
            .addTag('Properties', 'Property listing creation, search and management')
            .addTag('Verification', 'Broker document verification workflow')
            .addTag('Messages', 'Real-time certified messaging between buyers and sellers')
            .addTag('Marketplace', 'Market data analytics, comparables and property valuation')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`PropConnect API running on port ${port}`, 'Bootstrap');
    logger.log(`Swagger docs at http://localhost:${port}/docs`, 'Bootstrap');
}
bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map