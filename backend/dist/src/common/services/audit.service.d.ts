import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logAction(params: {
        userId?: string;
        action: string;
        resource: string;
        resourceId?: string;
        ipAddress?: string;
        userAgent?: string;
        details?: any;
    }): Promise<void>;
}
