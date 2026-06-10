import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

const IS_PROD = process.env.NODE_ENV === 'production';

const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, context, stack, durationMs, ...meta }) => {
    const ctx = context ? `[${context}]` : '[App]';
    const dur = durationMs !== undefined ? ` +${durationMs}ms` : '';
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} ${ctx} ${level}: ${message}${dur}${extra}${stackStr}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.json(),
);

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: IS_PROD ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.errors({ stack: true }),
        IS_PROD ? prodFormat : devFormat,
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { context, stack: trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  /** Log a timed operation result: method name, duration, optional extra metadata. */
  timed(context: string, method: string, durationMs: number, meta?: Record<string, unknown>): void {
    this.logger.debug(`${method} completed`, { context, durationMs, ...meta });
  }

  security(event: Record<string, unknown>): void {
    this.logger.warn('[SECURITY]', { ...event, type: 'security_event' });
  }
}
