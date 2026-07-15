import { PrismaService } from '../../../prisma/prisma.service';
import { OpenAiClientService } from '../../ai/services/openai-client.service';
import { LoggerService } from '../../../common/services/logger.service';
export declare class RagIndexerService {
    private readonly prisma;
    private readonly openai;
    private readonly logger;
    constructor(prisma: PrismaService, openai: OpenAiClientService, logger: LoggerService);
    indexDocument(documentId: string, content: string): Promise<number>;
    retrieveRelevantChunks(queryText: string, projectId?: string, topK?: number): Promise<any[]>;
}
