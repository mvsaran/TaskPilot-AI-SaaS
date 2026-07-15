import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { AuditService } from './services/audit.service';
import { MetricsService } from './services/metrics.service';
import { CommonController } from './controllers/common.controller';

@Global()
@Module({
  controllers: [CommonController],
  providers: [LoggerService, AuditService, MetricsService],
  exports: [LoggerService, AuditService, MetricsService],
})
export class CommonModule {}
