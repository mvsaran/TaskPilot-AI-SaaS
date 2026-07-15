import { ProjectsService } from './projects.service';
import { ProjectStatus } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(status?: ProjectStatus, teamId?: string, ownerId?: string): Promise<({
        _count: {
            epics: number;
            sprints: number;
        };
        team: {
            id: string;
            name: string;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        key: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        ownerId: string;
        teamId: string | null;
        healthScore: number;
        riskFactors: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        team: {
            id: string;
            name: string;
            description: string;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string;
        };
        epics: ({
            _count: {
                stories: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            key: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            projectId: string;
            title: string;
            priority: import(".prisma/client").$Enums.Priority;
        })[];
        sprints: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        key: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        ownerId: string;
        teamId: string | null;
        healthScore: number;
        riskFactors: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getHealthMetrics(id: string): Promise<{
        projectId: string;
        key: string;
        name: string;
        healthScore: number;
        riskFactors: any;
        activeSprint: {
            id: string;
            name: string;
            velocity: number;
            completionRate: number;
        };
    }>;
    create(body: {
        key: string;
        name: string;
        description?: string;
        teamId?: string;
    }, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        key: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        ownerId: string;
        teamId: string | null;
        healthScore: number;
        riskFactors: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, body: any, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        key: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        ownerId: string;
        teamId: string | null;
        healthScore: number;
        riskFactors: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
