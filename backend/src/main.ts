import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggerService } from './shared/services/logger.service';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();

  const app = await NestFactory.create(AppModule, { logger });

  // Security middleware
  app.use(helmet());
  app.use(compression());

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (err) =>
            `${err.property}: ${Object.values(err.constraints ?? {}).join(', ')}`,
        );
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global HTTP logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger — disabled in production via env
  if (process.env.API_DOCS_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('PropConnect API')
      .setDescription(
        'PropConnect — Digital Real Estate Platform API\n\nBase URL: `https://api.propconnect.it/api`',
      )
      .setVersion('1.0.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
      .addTag('Authentication', 'User registration, login and token management')
      .addTag('Users', 'User profiles and KYC document upload')
      .addTag('Properties', 'Property listing creation, search and management')
      .addTag('Verification', 'Broker document verification workflow')
      .addTag('Messages', 'Real-time certified messaging between buyers and sellers')
      .addTag('Marketplace', 'Market data analytics, comparables and property valuation')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`PropConnect API running on port ${port}`, 'Bootstrap');
  logger.log(
    `Swagger docs at http://localhost:${port}/docs`,
    'Bootstrap',
  );
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
