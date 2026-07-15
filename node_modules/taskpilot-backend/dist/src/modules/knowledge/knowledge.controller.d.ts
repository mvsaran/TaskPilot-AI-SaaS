import { KnowledgeService } from './knowledge.service';
export declare class KnowledgeController {
    private readonly knowledgeService;
    constructor(knowledgeService: KnowledgeService);
    findAll(projectId?: string): Promise<({
        _count: {
            chunks: number;
        };
        uploader: {
            id: string;
            fullName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        projectId: string | null;
        title: string;
        fileName: string;
        fileUrl: string | null;
        fileType: string;
        tokenCount: number | null;
        uploaderId: string;
    })[]>;
    search(query: string, projectId?: string, topK?: number): Promise<any[]>;
    findOne(id: string): Promise<{
        uploader: {
            id: string;
            email: string;
            fullName: string;
        };
        chunks: {
            id: string;
            content: string;
            tokenCount: number;
            chunkIndex: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        projectId: string | null;
        title: string;
        fileName: string;
        fileUrl: string | null;
        fileType: string;
        tokenCount: number | null;
        uploaderId: string;
    }>;
    create(body: {
        title: string;
        fileName: string;
        fileType: string;
        content: string;
        projectId?: string;
    }, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        projectId: string | null;
        title: string;
        fileName: string;
        fileUrl: string | null;
        fileType: string;
        tokenCount: number | null;
        uploaderId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        projectId: string | null;
        title: string;
        fileName: string;
        fileUrl: string | null;
        fileType: string;
        tokenCount: number | null;
        uploaderId: string;
    }>;
}
