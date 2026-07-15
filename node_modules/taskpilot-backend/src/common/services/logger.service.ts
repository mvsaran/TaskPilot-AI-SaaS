import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const ctx = context ? `[${context}] ` : '';
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `${timestamp} ${level}: ${ctx}${message} ${metaStr}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: any, context?: string, ...optionalParams: any[]) {
    this.logger.info(message, { context, ...optionalParams });
  }

  error(message: any, trace?: string, context?: string, ...optionalParams: any[]) {
    this.logger.error(message, { trace, context, ...optionalParams });
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    this.logger.warn(message, { context, ...optionalParams });
  }

  debug?(message: any, context?: string, ...optionalParams: any[]) {
    this.logger.debug(message, { context, ...optionalParams });
  }

  verbose?(message: any, context?: string, ...optionalParams: any[]) {
    this.logger.verbose(message, { context, ...optionalParams });
  }
}
