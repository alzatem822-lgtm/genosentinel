// clinical-service/src/utils/logger.utils.ts
import { config } from '../config/env.config';

export class Logger {
  static error(message: string, meta?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static warn(message: string, meta?: any) {
    if (config.LOG_LEVEL === 'error') return;
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static info(message: string, meta?: any) {
    if (config.LOG_LEVEL === 'error' || config.LOG_LEVEL === 'warn') return;
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static debug(message: string, meta?: any) {
    if (config.LOG_LEVEL !== 'debug') return;
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
  }
}