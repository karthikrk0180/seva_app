/**
 * Logger Service
 * Centralized logging for the application.
 * Switches between console and external services (like Crashlytics) based on environment.
 */

import { APP_CONFIG } from 'src/config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class LoggerService {
  private static instance: LoggerService;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logData = { timestamp, level, message, meta };

    if (__DEV__) {
        // Pretty print in development
        const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m'; 
        console.log(`${color}[${level.toUpperCase()}] ${message}`, meta ? meta : '');
    } else {
      // TODO: Send to remote logging service (e.g. Firebase Crashlytics or Sentry)
      // crashlytics().log(JSON.stringify(logData));
    }
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  public error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    this.log('error', message, { ...meta, error });
  }
}

export const logger = LoggerService.getInstance();
