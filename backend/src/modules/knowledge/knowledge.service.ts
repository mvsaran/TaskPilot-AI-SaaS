import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RagIndexerService } from './services/rag-indexer.service';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ragIndexer: RagIndexerService,
  ) {}

  async findAll(projectId?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;

    return this.prisma.knowledgeDocument.findMany({
      where,
      include: {
        uploader: { select: { id: true, fullName: true, avatarUrl: true } },
        _count: { select: { chunks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Knowledge Document with ID ${id} not found`);
    }
    return doc;
  }

  async createDocument(params: {
    title: string;
    fileName: string;
    fileType: string;
    content: string;
    projectId?: string;
    uploaderId: string;
  }) {
    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        title: params.title,
        fileName: params.fileName,
        fileType: params.fileType,
        status: DocumentStatus.PROCESSING,
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

  async deleteDocument(id: string) {
    await this.findOne(id);
    return this.prisma.knowledgeDocument.delete({ where: { id } });
  }

  async testSearch(query: string, projectId?: string, topK: number = 3) {
    return this.ragIndexer.retrieveRelevantChunks(query, projectId, topK);
  }
}
