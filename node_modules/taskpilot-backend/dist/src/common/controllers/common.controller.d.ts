import { PrismaService } from '../../prisma/prisma.service';
export declare class CommonController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(verbose?: string): Promise<{
        status: string;
        database: string;
        timestamp: string;
        uptime: number;
    } | {
        diagnostics: {
            nodeEnv: string;
            databaseUrl: string;
            redisUrl: string;
            jwtExpiresIn: string;
            memoryUsage: NodeJS.MemoryUsage;
        };
        status: string;
        database: string;
        timestamp: string;
        uptime: number;
    }>;
}
