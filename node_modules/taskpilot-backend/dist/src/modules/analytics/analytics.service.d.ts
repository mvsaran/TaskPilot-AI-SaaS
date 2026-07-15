import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getExecutiveDashboard(teamId?: string): Promise<{
        summary: {
            totalProjects: number;
            activeProjects: number;
            totalTasks: number;
            completedTasks: number;
            completionRate: number;
            activeSprints: number;
            averageHealthScore: number;
            totalAuditLogs: number;
        };
        projects: {
            id: string;
            name: string;
            key: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            healthScore: number;
        }[];
        releaseReadiness: string;
    }>;
    getVelocityChart(projectId: string): Promise<{
        sprintId: string;
        name: string;
        velocity: number;
        targetPoints: number;
    }[]>;
    getTaskDistribution(projectId?: string): Promise<{
        TODO: number;
        IN_PROGRESS: number;
        IN_REVIEW: number;
        DONE: number;
    }>;
}
