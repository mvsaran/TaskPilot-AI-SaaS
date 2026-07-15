import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { MetricsService } from '../services/metrics.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly metrics;
    constructor(logger: LoggerService, metrics: MetricsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
