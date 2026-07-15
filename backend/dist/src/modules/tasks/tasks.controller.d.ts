import { TasksService } from './tasks.service';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TasksController {
    private readonly tasksService;
    private readonly prisma;
    constructor(tasksService: TasksService, prisma: PrismaService);
    findAll(query: any): Promise<{
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
    getEpics(projectId: string): Promise<({
        stories: ({
            _count: {
                tasks: number;
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
        })[];
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
    })[]>;
    getStories(epicId: string): Promise<({
        _count: {
            tasks: number;
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
    })[]>;
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
    create(body: any, user: any): Promise<{
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
    updateStatus(id: string, status: TaskStatus, user: any, ifMatch?: string): Promise<{
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
    update(id: string, body: any, user: any): Promise<{
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
    addComment(taskId: string, content: string, user: any): Promise<{
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
    createSubtask(taskId: string, body: {
        title: string;
        assigneeId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        isCompleted: boolean;
        taskId: string;
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
}
