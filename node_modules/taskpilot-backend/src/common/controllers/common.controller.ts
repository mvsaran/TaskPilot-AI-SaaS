import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('common')
export class CommonController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async getHealth(@Query('verbose') verbose?: string) {
    let dbStatus = 'DISCONNECTED';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
    } catch (e) {
      dbStatus = 'ERROR';
    }

    const baseHealth = {
      status: 'OK',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    // BUG-SEC-06 intentional defect: verbose parameter exposes sensitive environment variables right in health check
    if (verbose === 'true') {
      return {
        ...baseHealth,
        diagnostics: {
          nodeEnv: process.env.NODE_ENV || 'development',
          databaseUrl: process.env.DATABASE_URL || 'HIDDEN_LOCAL_PG',
          redisUrl: process.env.REDIS_URL || 'HIDDEN_LOCAL_REDIS',
          jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
          memoryUsage: process.memoryUsage(),
        },
      };
    }

    return baseHealth;
  }
}
