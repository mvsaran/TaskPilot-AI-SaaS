import { Module, forwardRef } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiCacheService } from './services/ai-cache.service';
import { PromptManagerService } from './services/prompt-manager.service';
import { OpenAiClientService } from './services/openai-client.service';
import { ResponseParserService } from './services/response-parser.service';
import { KnowledgeModule } from '../knowledge/knowledge.module';

@Module({
  imports: [forwardRef(() => KnowledgeModule)],
  controllers: [AiController],
  providers: [
    AiService,
    AiCacheService,
    PromptManagerService,
    OpenAiClientService,
    ResponseParserService,
  ],
  exports: [AiService, OpenAiClientService, PromptManagerService, AiCacheService],
})
export class AiModule {}
