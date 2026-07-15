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
exports.KnowledgeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const rag_indexer_service_1 = require("./services/rag-indexer.service");
const client_1 = require("@prisma/client");
let KnowledgeService = class KnowledgeService {
    constructor(prisma, ragIndexer) {
        this.prisma = prisma;
        this.ragIndexer = ragIndexer;
    }
    async findAll(projectId) {
        const where = {};
        if (projectId)
            where.projectId = projectId;
        return this.prisma.knowledgeDocument.findMany({
            where,
            include: {
                uploader: { select: { id: true, fullName: true, avatarUrl: true } },
                _count: { select: { chunks: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const doc = await this.prisma.knowledgeDocument.findUnique({
            where: { id },
            include: {
                uploader: { select: { id: true, fullName: true, email: true } },
                chunks: {
                    select: { id: true, chunkIndex: true, content: true, tokenCount: true },
                    orderBy: { chunkIndex: 'asc' },
                },
            },
        });
        if (!doc) {
            throw new common_1.NotFoundException(`Knowledge Document with ID ${id} not found`);
        }
        return doc;
    }
    async createDocument(params) {
        const doc = await this.prisma.knowledgeDocument.create({
            data: {
                title: params.title,
                fileName: params.fileName,
                fileType: params.fileType,
                status: client_1.DocumentStatus.PROCESSING,
                projectId: params.projectId || null,
                uploaderId: params.uploaderId,
            },
        });
        // Trigger async RAG indexing
        setTimeout(() => {
            this.ragIndexer.indexDocument(doc.id, params.content).catch(err => {
                console.error(`Background indexing error for doc ${doc.id}:`, err);
            });
        }, 100);
        return doc;
    }
    async deleteDocument(id) {
        await this.findOne(id);
        return this.prisma.knowledgeDocument.delete({ where: { id } });
    }
    async testSearch(query, projectId, topK = 3) {
        return this.ragIndexer.retrieveRelevantChunks(query, projectId, topK);
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rag_indexer_service_1.RagIndexerService])
], KnowledgeService);
//# sourceMappingURL=knowledge.service.js.map