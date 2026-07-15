import { LoggerService as NestLoggerService } from '@nestjs/common';
export declare class LoggerService implements NestLoggerService {
    private logger;
    constructor();
    log(message: any, context?: string, ...optionalParams: any[]): void;
    error(message: any, trace?: string, context?: string, ...optionalParams: any[]): void;
    warn(message: any, context?: string, ...optionalParams: any[]): void;
    debug?(message: any, context?: string, ...optionalParams: any[]): void;
    verbose?(message: any, context?: string, ...optionalParams: any[]): void;
}
