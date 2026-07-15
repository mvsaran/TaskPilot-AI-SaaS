import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: any;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId || null,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          details: params.details ? JSON.stringify(params.details) : null,
        },
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}
