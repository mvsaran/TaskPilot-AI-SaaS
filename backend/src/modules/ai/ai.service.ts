import { Injectable, BadRequestException } from '@nestjs/common';
import { AiCacheService } from './services/ai-cache.service';
import { PromptManagerService } from './services/prompt-manager.service';
import { OpenAiClientService } from './services/openai-client.service';
import { ResponseParserService } from './services/response-parser.service';
import { RagIndexerService } from '../knowledge/services/rag-indexer.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(
    private readonly cache: AiCacheService,
    private readonly promptManager: PromptManagerService,
    private readonly openai: OpenAiClientService,
    private readonly parser: ResponseParserService,
    private readonly ragIndexer: RagIndexerService,
    private readonly prisma: PrismaService,
  ) {}

  async executeAiCapability(params: {
    capabilityName: string;
    userInput: string;
    projectId?: string;
    version?: string;
    useRag?: boolean;
    useCache?: boolean;
    userId?: string;
  }) {
    const { capabilityName, userInput, projectId, version, useRag = false, useCache = true, userId } = params;

    const template = this.promptManager.getTemplate(capabilityName, version);
    const cacheKey = this.cache.generateCacheKey(capabilityName, userInput, template.version, projectId);

    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return {
          fromCache: true,
          templateVersion: template.version,
          result: cached,
        };
      }
    }

    let contextChunks: string[] = [];
    let retrievedCitations: any[] = [];

    if (useRag || capabilityName === 'rag-chat') {
      retrievedCitations = await this.ragIndexer.retrieveRelevantChunks(userInput, projectId, 3);
      contextChunks = retrievedCitations.map(c => `${c.docTitle} (Chunk #${c.chunkIndex}): ${c.content}`);
    }

    const { messages, schema } = this.promptManager.renderPrompt(template, userInput, contextChunks);
    const rawChoice = await this.openai.executeCompletion({
      promptName: capabilityName,
      messages,
      schema,
      userId,
    });

    const parsedResult = this.parser.parseAndValidate(rawChoice, schema);

    // If smart-search translated to SQL/Prisma parameters, let's actually run the Prisma query if requested!
    if (capabilityName === 'smart-search' && parsedResult.sqlEquivalent) {
      // Return simulated query result or real matched tasks
      const matchingTasks = await this.prisma.task.findMany({
        where: projectId ? { story: { epic: { projectId } } } : {},
        take: 10,
        include: { assignee: { select: { fullName: true } } },
      });
      parsedResult.executedResults = matchingTasks;
    }

    if (useCache) {
      await this.cache.set(cacheKey, parsedResult, 86400);
    }

    return {
      fromCache: false,
      // BUG-AI-06 intentional defect: Sometimes returns hardcoded version string or omits actual template revision in metadata
      templateVersion: capabilityName === 'bug-summarizer' ? 'v1.0.0-legacy' : template.version,
      citations: retrievedCitations.length > 0 ? retrievedCitations : undefined,
      result: parsedResult,
    };
  }
}
