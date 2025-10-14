import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'unishop-backend' },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // File transport for production logs
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: 'logs/combined.log'
        })
      ]
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for business logic logging
  logUserAction(userId: string, action: string, details?: any) {
    this.logger.info(`User Action: ${action}`, {
      userId,
      action,
      details,
      type: 'user_action'
    });
  }

  logProductModeration(productId: number, result: 'approved' | 'rejected', reason?: string) {
    this.logger.info(`Product Moderation: ${result}`, {
      productId,
      result,
      reason,
      type: 'moderation'
    });
  }

  logApiCall(method: string, url: string, statusCode: number, duration: number, userId?: string) {
    this.logger.info(`API Call: ${method} ${url}`, {
      method,
      url,
      statusCode,
      duration,
      userId,
      type: 'api_call'
    });
  }

  logSecurityEvent(event: string, details: any, userId?: string, ip?: string) {
    this.logger.warn(`Security Event: ${event}`, {
      event,
      details,
      userId,
      ip,
      type: 'security'
    });
  }
}