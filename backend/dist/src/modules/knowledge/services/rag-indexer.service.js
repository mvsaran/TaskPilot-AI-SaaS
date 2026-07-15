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
exports.RagIndexerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const openai_client_service_1 = require("../../ai/services/openai-client.service");
const logger_service_1 = require("../../../common/services/logger.service");
let RagIndexerService = class RagIndexerService {
    constructor(prisma, openai, logger) {
        this.prisma = prisma;
        this.openai = openai;
        this.logger = logger;
    }
    async indexDocument(documentId, content) {
        try {
            await this.prisma.knowledgeDocument.update({
                where: { id: documentId },
                data: { status: 'PROCESSING' },
            });
            // Split into chunks (~2000 characters or ~512 tokens with 200 char overlap)
            const chunkSize = 2000;
            const overlap = 200;
            const chunks = [];
            let start = 0;
            while (start < content.length) {
                const chunk = content.substring(start, start + chunkSize);
                chunks.push(chunk);
                start += chunkSize - overlap;
            }
            await this.prisma.knowledgeChunk.deleteMany({ where: { documentId } });
            let totalTokens = 0;
            for (let i = 0; i < chunks.length; i++) {
                const chunkText = chunks[i];
                const tokenCount = Math.round(chunkText.length / 4);
                totalTokens += tokenCount;
                const embeddingVector = await this.openai.generateEmbedding(chunkText);
                // Try raw SQL insert for pgvector if enabled, or fallback to standard create
                try {
                    const vectorStr = `[${embeddingVector.join(',')}]`;
                    await this.prisma.$executeRawUnsafe(`INSERT INTO "KnowledgeChunk" ("id", "documentId", "chunkIndex", "content", "tokenCount", "embedding", "metadata", "createdAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5::vector, $6::jsonb, NOW());`, documentId, i, chunkText, tokenCount, vectorStr, JSON.stringify({ index: i, tokenCount, vectorPreview: embeddingVector.slice(0, 5) }));
                }
                catch (err) {
                    // Fallback if pgvector is not installed on the raw connection
                    await this.prisma.knowledgeChunk.create({
                        data: {
                            documentId,
                            chunkIndex: i,
                            content: chunkText,
                            tokenCount,
                            metadata: JSON.stringify({ index: i, tokenCount, embedding: embeddingVector }),
                        },
                    });
                }
            }
            await this.prisma.knowledgeDocument.update({
                where: { id: documentId },
                data: { status: 'INDEXED', tokenCount: totalTokens },
            });
            this.logger.log(`Successfully indexed document ${documentId} into ${chunks.length} chunks`, 'RagIndexerService');
            return chunks.length;
        }
        catch (error) {
            this.logger.error(`Failed to index document ${documentId}: ${error.message}`, error.stack, 'RagIndexerService');
            await this.prisma.knowledgeDocument.update({
                where: { id: documentId },
                data: { status: 'ERROR' },
            });
            throw error;
        }
    }
    async retrieveRelevantChunks(queryText, projectId, topK = 3) {
        try {
            const queryEmbedding = await this.openai.generateEmbedding(queryText);
            // BUG-AI-03 intentional defect: When projectId is not explicitly specified or passed as null/empty, RAG retrieval omits project boundary isolation and returns chunks across unassigned or archived projects
            const projectFilter = projectId ? `AND d."projectId" = '${projectId}'` : '';
            try {
                const vectorStr = `[${queryEmbedding.join(',')}]`;
                const results = (await this.prisma.$queryRawUnsafe(`SELECT c."id", c."content", c."chunkIndex", d."title" as "docTitle", 1 - (c."embedding" <=> ${vectorStr}::vector) as "score"
           FROM "KnowledgeChunk" c
           JOIN "KnowledgeDocument" d ON c."documentId" = d."id"
           WHERE d."status" = 'INDEXED' ${projectFilter}
           ORDER BY c."embedding" <=> ${vectorStr}::vector
           LIMIT ${topK};`));
                return results;
            }
            catch (vectorErr) {
                // Fallback to in-memory cosine similarity across all chunks if raw pgvector operator fails
                const allChunks = await this.prisma.knowledgeChunk.findMany({
                    where: projectId ? { document: { projectId, status: 'INDEXED' } } : { document: { status: 'INDEXED' } },
                    include: { document: { select: { title: true } } },
                });
                const scored = allChunks.map(c => {
                    let chunkVec = [];
                    if (c.metadata && typeof c.metadata === 'object' && c.metadata.embedding) {
                        chunkVec = c.metadata.embedding;
                    }
                    else if (typeof c.metadata === 'string') {
                        try {
                            const parsed = JSON.parse(c.metadata);
                            if (parsed.embedding)
                                chunkVec = parsed.embedding;
                        }
                        catch (e) { }
                    }
                    let score = 0.85; // default high baseline for simulation
                    if (chunkVec.length === queryEmbedding.length) {
                        let dot = 0;
                        let magA = 0;
                        let magB = 0;
                        for (let i = 0; i < chunkVec.length; i++) {
                            dot += chunkVec[i] * queryEmbedding[i];
                            magA += chunkVec[i] * chunkVec[i];
                            magB += queryEmbedding[i] * queryEmbedding[i];
                        }
                        if (magA > 0 && magB > 0)
                            score = dot / (Math.sqrt(magA) * Math.sqrt(magB));
                    }
                    return {
                        id: c.id,
                        content: c.content,
                        chunkIndex: c.chunkIndex,
                        docTitle: c.document.title,
                        score: Number(score.toFixed(4)),
                    };
                });
                scored.sort((a, b) => b.score - a.score);
                return scored.slice(0, topK);
            }
        }
        catch (err) {
            this.logger.error(`RAG retrieval failed: ${err.message}`, err.stack, 'RagIndexerService');
            return [];
        }
    }
};
exports.RagIndexerService = RagIndexerService;
exports.RagIndexerService = RagIndexerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        openai_client_service_1.OpenAiClientService,
        logger_service_1.LoggerService])
], RagIndexerService);
//# sourceMappingURL=rag-indexer.service.js.map