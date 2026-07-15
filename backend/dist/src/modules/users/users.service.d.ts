import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, role?: UserRole, search?: string): Promise<{
        data: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatarUrl: string;
            isActive: boolean;
            createdAt: Date;
            teamMemberships: ({
                team: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                role: string | null;
                teamId: string;
                userId: string;
                joinedAt: Date;
            })[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        isActive: boolean;
        createdAt: Date;
        teamMemberships: ({
            team: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: string;
            role: string | null;
            teamId: string;
            userId: string;
            joinedAt: Date;
        })[];
    }>;
    updateRole(id: string, role: UserRole): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    toggleActive(id: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        isActive: boolean;
    }>;
}
