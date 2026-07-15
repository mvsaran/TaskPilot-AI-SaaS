import { PrismaService } from '../../prisma/prisma.service';
import { TaskStatus, Priority } from '@prisma/client';
import { AuditService } from '../../common/services/audit.service';
export declare class TasksService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    findAll(params: {
        projectId?: string;
        sprintId?: string;
        assigneeId?: string;
        status?: TaskStatus;
        priority?: Priority;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            _count: {
                comments: number;
            };
            sprint: {
                id: string;
                name: string;
            };
            story: {
                id: string;
                key: string;
                title: string;
            };
            assignee: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string;
            };
            reporter: {
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        comments: ({
            author: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            taskId: string;
            authorId: string;
            mentions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        activityLogs: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            projectId: string | null;
            userId: string;
            action: string;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            taskId: string | null;
        })[];
        sprint: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.SprintStatus;
        };
        story: {
            epic: {
                id: string;
                key: string;
                projectId: string;
                title: string;
            };
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
            acceptanceCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            definitionOfDone: import("@prisma/client/runtime/library").JsonValue | null;
            epicId: string | null;
        };
        assignee: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string;
        };
        reporter: {
            id: string;
            email: string;
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
    }>;
    create(data: any, reporterId: string): Promise<{
        assignee: {
            id: string;
            fullName: string;
            avatarUrl: string;
        };
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
    }>;
    updateStatus(id: string, status: TaskStatus, userId: string, versionHeader?: string): Promise<{
        assignee: {
            id: string;
            fullName: string;
            avatarUrl: string;
        };
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
    }>;
    update(id: string, data: any, userId: string): Promise<{
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
    }>;
    addComment(taskId: string, content: string, authorId: string): Promise<{
        author: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        taskId: string;
        authorId: string;
        mentions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    toggleSubtask(subtaskId: string, isCompleted: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        isCompleted: boolean;
        taskId: string;
    }>;
    createSubtask(taskId: string, title: string, assigneeId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        isCompleted: boolean;
        taskId: string;
    }>;
}
