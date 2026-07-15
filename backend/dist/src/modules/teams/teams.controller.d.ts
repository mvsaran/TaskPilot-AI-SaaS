import { TeamsService } from './teams.service';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    findAll(): Promise<({
        _count: {
            members: number;
            projects: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    })[]>;
    findOne(id: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatarUrl: string;
            };
        } & {
            id: string;
            role: string | null;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
        projects: {
            id: string;
            name: string;
            key: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            healthScore: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    create(body: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    addMember(teamId: string, body: {
        userId: string;
        role?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        role: string | null;
        teamId: string;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(teamId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
