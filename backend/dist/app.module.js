"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const properties_module_1 = require("./modules/properties/properties.module");
const verification_module_1 = require("./modules/verification/verification.module");
const messaging_module_1 = require("./modules/messaging/messaging.module");
const marketplace_module_1 = require("./modules/marketplace/marketplace.module");
const shared_module_1 = require("./shared/shared.module");
const database_config_1 = require("./config/database.config");
const validation_config_1 = require("./config/validation.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
                validationSchema: (0, validation_config_1.getValidationSchema)(),
                validationOptions: {
                    abortEarly: false,
                },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: database_config_1.getDatabaseConfig,
            }),
            throttler_1.ThrottlerModule.forRoot({
                ttl: 60000,
                limit: 100,
            }),
            shared_module_1.SharedModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            properties_module_1.PropertiesModule,
            verification_module_1.VerificationModule,
            messaging_module_1.MessagingModule,
            marketplace_module_1.MarketplaceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map