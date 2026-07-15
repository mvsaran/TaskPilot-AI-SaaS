import { AiCacheService } from './services/ai-cache.service';
import { PromptManagerService } from './services/prompt-manager.service';
import { OpenAiClientService } from './services/openai-client.service';
import { ResponseParserService } from './services/response-parser.service';
import { RagIndexerService } from '../knowledge/services/rag-indexer.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AiService {
    private readonly cache;
    private readonly promptManager;
    private readonly openai;
    private readonly parser;
    private readonly ragIndexer;
    private readonly prisma;
    constructor(cache: AiCacheService, promptManager: PromptManagerService, openai: OpenAiClientService, parser: ResponseParserService, ragIndexer: RagIndexerService, prisma: PrismaService);
    executeAiCapability(params: {
        capabilityName: string;
        userInput: string;
        projectId?: string;
        version?: string;
        useRag?: boolean;
        useCache?: boolean;
        userId?: string;
    }): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
}
