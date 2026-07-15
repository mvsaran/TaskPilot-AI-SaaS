import { Module, forwardRef } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { RagIndexerService } from './services/rag-indexer.service';
import { KnowledgeController } from './knowledge.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [forwardRef(() => AiModule)],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, RagIndexerService],
  exports: [KnowledgeService, RagIndexerService],
})
export class KnowledgeModule {}
