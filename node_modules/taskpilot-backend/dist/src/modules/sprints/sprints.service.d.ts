import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
export declare class SprintsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findByProject(projectId: string): Promise<({
        _count: {
            tasks: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SprintStatus;
        goal: string | null;
        startDate: Date;
        endDate: Date;
        velocity: number | null;
        projectId: string;
    })[]>;
    findOne(id: string): Promise<{
        project: {
            id: string;
            name: string;
            key: string;
        };
        tasks: ({
            assignee: {
                id: string;
                fullName: string;
                avatarUrl: string;
            };
            subtasks: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                assigneeId: string | null;
                isCompleted: boolean;
                taskId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            key: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
            priority: import(".prisma/client").$Enums.Priority;
            storyPoints: number | null;
            estimatedHours: number | null;
            loggedHours: number | null;
            dueDate: Date | null;
            assigneeId: string | null;
            reporterId: string;
            storyId: string | null;
            sprintId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SprintStatus;
        goal: string | null;
        startDate: Date;
        endDate: Date;
        velocity: number | null;
        projectId: string;
    }>;
    create(data: {
        name: string;
        goal?: string;
        startDate: string;
        endDate: string;
        projectId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SprintStatus;
        goal: string | null;
        startDate: Date;
        endDate: Date;
        velocity: number | null;
        projectId: string;
    }>;
    startSprint(id: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SprintStatus;
        goal: string | null;
        startDate: Date;
        endDate: Date;
        velocity: number | null;
        projectId: string;
    }>;
    closeSprint(id: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SprintStatus;
        goal: string | null;
        startDate: Date;
        endDate: Date;
        velocity: number | null;
        projectId: string;
    }>;
    getBurndownData(id: string): Promise<{
        sprintId: string;
        sprintName: string;
        totalPoints: number;
        burndown: any[];
    }>;
}
