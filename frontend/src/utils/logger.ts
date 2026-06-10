type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const IS_DEV = import.meta.env.DEV;
const MIN_LEVEL: LogLevel = IS_DEV ? 'debug' : 'warn';

const LEVEL_STYLES: Record<LogLevel, string> = {
  debug: 'color: #9ca3af',
  info:  'color: #3b82f6; font-weight: bold',
  warn:  'color: #f59e0b; font-weight: bold',
  error: 'color: #ef4444; font-weight: bold',
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[MIN_LEVEL];
}

function emit(level: LogLevel, context: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const ts = new Date().toISOString().slice(11, 23); // HH:mm:ss.mmm
  const prefix = `%c${ts} [${context}] ${level.toUpperCase()}`;
  const style = LEVEL_STYLES[level];

  if (data !== undefined) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'debug' : level](prefix, style, message, data);
  } else {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'debug' : level](prefix, style, message);
  }
}

export interface Logger {
  debug: (message: string, data?: unknown) => void;
  info:  (message: string, data?: unknown) => void;
  warn:  (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
}

export function createLogger(context: string): Logger {
  return {
    debug: (message, data) => emit('debug', context, message, data),
    info:  (message, data) => emit('info',  context, message, data),
    warn:  (message, data) => emit('warn',  context, message, data),
    error: (message, data) => emit('error', context, message, data),
  };
}
