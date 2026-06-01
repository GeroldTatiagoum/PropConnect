"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationSchema = getValidationSchema;
const Joi = __importStar(require("joi"));
const skipFlag = () => Joi.boolean().truthy('true', '1').falsy('false', '0', '').default(false);
function getValidationSchema() {
    return Joi.object({
        NODE_ENV: Joi.string()
            .valid('development', 'staging', 'production', 'test')
            .default('development'),
        PORT: Joi.number().default(3000),
        // Skip flags — set to true to bypass validation of a config group
        SKIP_DB_CONFIG: skipFlag(),
        SKIP_JWT_CONFIG: skipFlag(),
        SKIP_AWS_CONFIG: skipFlag(),
        // Database
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.when('SKIP_DB_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        DB_PASSWORD: Joi.when('SKIP_DB_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        DB_NAME: Joi.when('SKIP_DB_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        // JWT
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
        JWT_SECRET: Joi.when('SKIP_JWT_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().min(32).required(),
        }),
        JWT_REFRESH_SECRET: Joi.when('SKIP_JWT_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().min(32).required(),
        }),
        // Redis
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().optional().allow(''),
        // AWS
        AWS_REGION: Joi.string().default('eu-south-1'),
        AWS_ACCESS_KEY_ID: Joi.when('SKIP_AWS_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        AWS_SECRET_ACCESS_KEY: Joi.when('SKIP_AWS_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        AWS_S3_BUCKET: Joi.when('SKIP_AWS_CONFIG', {
            is: true,
            then: Joi.string().optional().allow('').default(''),
            otherwise: Joi.string().required(),
        }),
        // CORS
        CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
        // Optional
        API_DOCS_ENABLED: Joi.boolean().default(true),
        SENDGRID_API_KEY: Joi.string().optional(),
    });
}
//# sourceMappingURL=validation.config.js.map