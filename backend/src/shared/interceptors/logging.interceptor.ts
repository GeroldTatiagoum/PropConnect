import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

interface AuthenticatedRequest extends Request {
  user?: { id?: string; email?: string; role?: string };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { method, url, ip, body, query } = req;
    const userAgent = req.get('user-agent') ?? '-';
    const startTime = Date.now();

    const userId = req.user?.id ?? 'anonymous';
    const role = req.user?.role ?? '-';

    const queryStr = Object.keys(query).length ? ` query=${JSON.stringify(query)}` : '';
    const bodySize = req.get('content-length') ?? '0';

    this.logger.debug(
      `→ ${method} ${url} user=${userId} role=${role} ip=${ip} ua="${userAgent}"${queryStr} body=${bodySize}b`,
      'HTTP',
    );

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>();
        const durationMs = Date.now() - startTime;
        const { statusCode } = res;

        if (statusCode >= 400) {
          this.logger.warn(
            `← ${method} ${url} ${statusCode} ${durationMs}ms user=${userId}`,
            'HTTP',
          );
        } else {
          this.logger.log(
            `← ${method} ${url} ${statusCode} ${durationMs}ms user=${userId}`,
            'HTTP',
          );
        }
      }),
      catchError((err: Error) => {
        const durationMs = Date.now() - startTime;
        this.logger.warn(
          `← ${method} ${url} ERROR ${durationMs}ms user=${userId}: ${err.message}`,
          'HTTP',
        );
        return throwError(() => err);
      }),
    );
  }
}
