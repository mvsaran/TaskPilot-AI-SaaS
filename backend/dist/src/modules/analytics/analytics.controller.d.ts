import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(teamId?: string): Promise<{
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
    getVelocity(projectId: string): Promise<{
        sprintId: string;
        name: string;
        velocity: number;
        targetPoints: number;
    }[]>;
    getDistribution(projectId?: string): Promise<{
        TODO: number;
        IN_PROGRESS: number;
        IN_REVIEW: number;
        DONE: number;
    }>;
}
