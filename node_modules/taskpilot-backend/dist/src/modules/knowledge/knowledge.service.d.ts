import { PrismaService } from '../../prisma/prisma.service';
import { RagIndexerService } from './services/rag-indexer.service';
export declare class KnowledgeService {
    private readonly prisma;
    private readonly ragIndexer;
    constructor(prisma: PrismaService, ragIndexer: RagIndexerService);
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
    createDocument(params: {
        title: string;
        fileName: string;
        fileType: string;
        content: string;
        projectId?: string;
        uploaderId: string;
    }): Promise<{
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
    deleteDocument(id: string): Promise<{
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
    testSearch(query: string, projectId?: string, topK?: number): Promise<any[]>;
}
