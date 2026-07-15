import { Controller, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('AI Hub & Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('task-generator')
  @ApiOperation({ summary: '1. AI Task & Epic Generator: Break down feature requests into structured stories & tasks' })
  async generateTasks(@Body() body: { prompt: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'task-generator',
      userInput: body.prompt,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('sprint-planner')
  @ApiOperation({ summary: '2. AI Sprint Planner: Recommend task distribution, velocity prediction, and workload balance' })
  async planSprint(@Body() body: { prompt: string; projectId: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'sprint-planner',
      userInput: body.prompt,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('story-generator')
  @ApiOperation({ summary: '3. AI User Story Generator: Generate detailed Acceptance Criteria, DoD, Edge Cases & Risks' })
  async generateStory(@Body() body: { prompt: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'story-generator',
      userInput: body.prompt,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('summarize-bug')
  @ApiOperation({ summary: '4. AI Bug Summarizer: Analyze logs/stack traces to find Root Cause, Severity & Fixes' })
  async summarizeBug(@Body() body: { logs: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'bug-summarizer',
      userInput: body.logs,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('predict-risk')
  @ApiOperation({ summary: '5. AI Risk Prediction: Analyze overdue tasks, blockers, and velocity drop to predict risks' })
  async predictRisk(@Body() body: { projectContext: string; projectId: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'risk-predictor',
      userInput: body.projectContext,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('meeting-notes')
  @ApiOperation({ summary: '6. AI Meeting Notes: Summarize transcripts, Decisions, Action Items & Follow-ups' })
  async summarizeMeeting(@Body() body: { transcript: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'meeting-notes',
      userInput: body.transcript,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('smart-search')
  @ApiOperation({ summary: '7. AI Smart Search: Translate natural language queries to SQL/Prisma and execute' })
  async smartSearch(@Body() body: { query: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'smart-search',
      userInput: body.query,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('generate-report')
  @ApiOperation({ summary: '8. AI Report Generator: Generate Weekly Reports, Sprint Summaries & Release Readiness' })
  async generateReport(@Body() body: { timeframe: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'report-generator',
      userInput: body.timeframe,
      projectId: body.projectId,
      userId: user?.id,
    });
  }

  @Post('rag-chat')
  @ApiOperation({ summary: '9. AI Knowledge Assistant: RAG-based answer generation with exact citations over pgvector docs' })
  async ragChat(@Body() body: { question: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'rag-chat',
      userInput: body.question,
      projectId: body.projectId,
      useRag: true,
      userId: user?.id,
    });
  }

  @Post('assistant-chat')
  @ApiOperation({ summary: '10. Built-in Project Assistant: Real-time conversational co-pilot for workspace guidance' })
  async assistantChat(@Body() body: { message: string; projectId?: string }, @CurrentUser() user: any) {
    return this.aiService.executeAiCapability({
      capabilityName: 'assistant-chat',
      userInput: body.message,
      projectId: body.projectId,
      useRag: true,
      userId: user?.id,
    });
  }
}
