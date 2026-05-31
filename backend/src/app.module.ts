import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { VerificationModule } from './modules/verification/verification.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { SharedModule } from './shared/shared.module';
import { getDatabaseConfig } from './config/database.config';
import { getValidationSchema } from './config/validation.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: getValidationSchema(),
      validationOptions: {
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    SharedModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    VerificationModule,
    MessagingModule,
    MarketplaceModule,
  ],
})
export class AppModule {}
