import * as Joi from 'joi';

const skipFlag = () => Joi.boolean().truthy('true', '1').falsy('false', '0', '').default(false);

export function getValidationSchema() {
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
