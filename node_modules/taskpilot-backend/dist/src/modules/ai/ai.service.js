"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_cache_service_1 = require("./services/ai-cache.service");
const prompt_manager_service_1 = require("./services/prompt-manager.service");
const openai_client_service_1 = require("./services/openai-client.service");
const response_parser_service_1 = require("./services/response-parser.service");
const rag_indexer_service_1 = require("../knowledge/services/rag-indexer.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let AiService = class AiService {
    constructor(cache, promptManager, openai, parser, ragIndexer, prisma) {
        this.cache = cache;
        this.promptManager = promptManager;
        this.openai = openai;
        this.parser = parser;
        this.ragIndexer = ragIndexer;
        this.prisma = prisma;
    }
    async executeAiCapability(params) {
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
        let contextChunks = [];
        let retrievedCitations = [];
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_cache_service_1.AiCacheService,
        prompt_manager_service_1.PromptManagerService,
        openai_client_service_1.OpenAiClientService,
        response_parser_service_1.ResponseParserService,
        rag_indexer_service_1.RagIndexerService,
        prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map