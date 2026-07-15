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
exports.OpenAiClientService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const metrics_service_1 = require("../../../common/services/metrics.service");
const logger_service_1 = require("../../../common/services/logger.service");
let OpenAiClientService = class OpenAiClientService {
    constructor(metrics, logger) {
        this.metrics = metrics;
        this.logger = logger;
        this.openai = null;
        this.simulationMode = true;
        const apiKey = process.env.OPENAI_API_KEY;
        const simFlag = process.env.AI_SIMULATION_MODE;
        if (apiKey && apiKey.length > 10 && simFlag !== 'true') {
            this.openai = new openai_1.default({ apiKey });
            this.simulationMode = false;
            this.logger.log('OpenAI Client initialized in LIVE API Mode', 'OpenAiClientService');
        }
        else {
            this.simulationMode = true;
            this.logger.log('OpenAI Client initialized in HIGH-FIDELITY SIMULATION Mode', 'OpenAiClientService');
        }
    }
    async executeCompletion(params) {
        const startTime = Date.now();
        const { promptName, messages, schema, userId } = params;
        if (this.simulationMode) {
            return this.simulateStructuredResponse(promptName, messages, startTime, userId);
        }
        let retries = 3;
        let delay = 1000;
        while (retries > 0) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: process.env.AI_MODEL_NAME || 'gpt-4o',
                    messages: messages,
                    response_format: schema ? { type: 'json_object' } : undefined,
                    temperature: 0.3,
                });
                const latencyMs = Date.now() - startTime;
                const choice = response.choices[0]?.message?.content;
                const usage = response.usage;
                if (usage) {
                    const promptCost = (usage.prompt_tokens / 1000) * 0.005;
                    const compCost = (usage.completion_tokens / 1000) * 0.015;
                    await this.metrics.recordAiTokenUsage({
                        userId,
                        endpoint: `/ai/${promptName}`,
                        model: response.model,
                        promptTokens: usage.prompt_tokens,
                        completionTokens: usage.completion_tokens,
                        totalTokens: usage.total_tokens,
                        estimatedCostUSD: Number((promptCost + compCost).toFixed(6)),
                    });
                }
                if (schema && choice) {
                    try {
                        return JSON.parse(choice);
                    }
                    catch (e) {
                        this.logger.warn(`Failed to parse structured JSON from live OpenAI response: ${choice}`, 'OpenAiClientService');
                        return { raw: choice };
                    }
                }
                return choice;
            }
            catch (error) {
                retries--;
                if (retries === 0) {
                    this.logger.error(`OpenAI API call failed after retries: ${error.message}`, error.stack, 'OpenAiClientService');
                    throw new common_1.InternalServerErrorException(`AI execution failed: ${error.message}`);
                }
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            }
        }
    }
    async generateEmbedding(text) {
        if (this.simulationMode || !this.openai) {
            // Return deterministic mock 1536 vector based on string hash for local simulation & testing
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
                hash = (hash << 5) - hash + text.charCodeAt(i);
                hash |= 0;
            }
            const mockVector = [];
            for (let i = 0; i < 1536; i++) {
                const val = Math.sin((hash + i) * 0.1) * 0.1;
                mockVector.push(Number(val.toFixed(6)));
            }
            return mockVector;
        }
        try {
            const resp = await this.openai.embeddings.create({
                model: process.env.AI_EMBEDDING_MODEL || 'text-embedding-3-small',
                input: text,
            });
            return resp.data[0].embedding;
        }
        catch (err) {
            this.logger.warn(`Live embedding generation failed (${err.message}), using fallback mock vector`, 'OpenAiClientService');
            return this.generateEmbedding(text); // fallback to simulation vector
        }
    }
    async simulateStructuredResponse(promptName, messages, startTime, userId) {
        // Simulate realistic processing latency (200ms - 500ms)
        await new Promise(res => setTimeout(res, 250 + Math.random() * 250));
        const latencyMs = Date.now() - startTime;
        const lastUserMsg = messages[messages.length - 1]?.content || '';
        // BUG-AI-04 intentional defect: When input text contains specific unicode sequences like '⚠️' or '⚡' in specific simulation conditions, streaming or simulation terminates prematurely
        if (lastUserMsg.includes('⚠️💥')) {
            throw new common_1.InternalServerErrorException('Stream connection interrupted unexpectedly (BUG-AI-04 simulation)');
        }
        await this.metrics.recordAiTokenUsage({
            userId,
            endpoint: `/ai/${promptName}`,
            model: 'gpt-4o-simulation',
            promptTokens: Math.round(lastUserMsg.length / 4) + 120,
            completionTokens: 350,
            totalTokens: Math.round(lastUserMsg.length / 4) + 470,
            estimatedCostUSD: 0.0025,
        });
        switch (promptName) {
            case 'task-generator':
                return {
                    epic: {
                        title: `AI Epic: ${lastUserMsg.substring(0, 40)} Initiative`,
                        description: `Comprehensive architectural design, security review, and full-stack implementation for ${lastUserMsg}.`,
                        priority: 'CRITICAL',
                    },
                    stories: [
                        {
                            title: `Core API & Database Schema for ${lastUserMsg.substring(0, 25)}`,
                            description: `Implement NestJS controllers, DTO validation, and Prisma models.`,
                            storyPoints: 5,
                            priority: 'HIGH',
                            acceptanceCriteria: [
                                'All endpoints protected by JWT and RBAC guards',
                                'Input validated with class-validator',
                                'Response wrapped in standard format',
                            ],
                            tasks: [
                                { title: 'Create Prisma migration and models', estimatedHours: 4 },
                                { title: 'Write NestJS service logic and unit tests', estimatedHours: 6 },
                            ],
                        },
                        {
                            title: `React UI & State Integration for ${lastUserMsg.substring(0, 25)}`,
                            description: `Build responsive Material UI components with React Query and optimistic updates.`,
                            storyPoints: 8,
                            priority: 'CRITICAL',
                            acceptanceCriteria: [
                                'Responsive layout with dark mode support',
                                'Smooth skeleton loaders and error states',
                            ],
                            tasks: [
                                { title: 'Build React components and forms', estimatedHours: 6 },
                                { title: 'Connect Axios API client with React Query hooks', estimatedHours: 4 },
                            ],
                        },
                    ],
                };
            case 'sprint-planner':
                return {
                    recommendation: 'Sprint 2 Recommended Allocation',
                    status: 'BALANCED',
                    predictedCompletionRate: 94.5,
                    totalAssignedPoints: 42,
                    workloadWarnings: [
                        'Alex Rivera (Senior Dev) is allocated at 110% capacity. Consider shifting 1 story point to Contributor pool.',
                    ],
                    tasksDistributed: [
                        { taskId: 'TSK-1002', assignee: 'dev@taskpilot.ai', points: 8, status: 'IN_PROGRESS' },
                        { taskId: 'TSK-1005', assignee: 'user.1@taskpilot.ai', points: 5, status: 'TODO' },
                    ],
                };
            case 'story-generator':
                return {
                    storyTitle: `As an Enterprise User, I want ${lastUserMsg.substring(0, 35)} so that our workflow is seamless`,
                    acceptanceCriteria: [
                        'System verifies user permissions before execution',
                        'All changes are audit logged with IP and user agent',
                        'UI reflects updates within 200ms without page reload',
                    ],
                    definitionOfDone: [
                        'Code reviewed by at least 1 Senior Engineer',
                        'Automated integration tests verify positive and negative paths',
                        'Documentation updated in docs/API_SPEC.md',
                    ],
                    edgeCases: [
                        'Handling concurrent edits by two project managers',
                        'Network disconnection during streaming response',
                    ],
                    risks: [
                        { risk: 'Database lock contention during bulk update', severity: 'MEDIUM' },
                    ],
                };
            case 'bug-summarizer':
                return {
                    rootCause: 'Unhandled null pointer or optimistic locking mismatch during rapid drag-and-drop state transitions.',
                    severity: 'HIGH',
                    suggestedFixes: [
                        'Add explicit null checks and version number validation before executing Prisma update',
                        'Verify that React Query invalidates the sprint board cache immediately upon mutation rollback',
                    ],
                    relatedModules: ['TasksService (backend/src/modules/tasks)', 'KanbanBoardPage (frontend/src/pages/SprintBoard)'],
                };
            case 'risk-predictor':
                return {
                    overallRiskScore: 78.5,
                    riskLevel: 'HIGH',
                    analyzedMetrics: {
                        overdueTasksCount: 12,
                        blockedWorkCount: 4,
                        velocityVariance: '18% drop compared to previous sprint',
                    },
                    primaryDependencies: [
                        'Authentication module refresh token rotation stability',
                        'PgVector query latency on large document bases',
                    ],
                    mitigationPlan: [
                        'Reassign 2 blocked tasks from Alex Rivera to QA Automation pod',
                        'Increase Redis cache TTL for semantic search results from 1 hour to 24 hours',
                    ],
                };
            case 'meeting-notes':
                return {
                    meetingSummary: 'Strategic alignment meeting discussing TaskPilot AI production readiness, QA automation goals, and RAG vector search tuning.',
                    decisions: [
                        'Adopt dual-mode OpenAI + simulation client to ensure deterministic testing',
                        'Embed 50 intentional defects cleanly documented in docs/BUG_CATALOG.md',
                    ],
                    actionItems: [
                        { owner: 'Sarah Connor (Admin)', task: 'Finalize RBAC role assignment matrix', dueDate: '2026-07-16' },
                        { owner: 'Alex Rivera (Senior Dev)', task: 'Implement pgvector extension check and fallback cosine similarity', dueDate: '2026-07-17' },
                    ],
                    followUps: [
                        'Schedule performance load test for 50,000 comments seeding verification',
                    ],
                };
            case 'smart-search':
                return {
                    interpretedQuery: lastUserMsg,
                    sqlEquivalent: `SELECT * FROM "Task" WHERE "status" = 'TODO' OR "dueDate" < NOW() ORDER BY "priority" DESC LIMIT 20;`,
                    matchingTasksCount: 14,
                    resultsPreview: [
                        { id: 'TSK-1008', title: 'Optimize Redis cache serialization', priority: 'CRITICAL', assignee: 'Alex Rivera' },
                        { id: 'TSK-1015', title: 'Fix timezone offset on sprint due dates', priority: 'HIGH', assignee: 'Maya Lin' },
                    ],
                };
            case 'report-generator':
                return {
                    reportTitle: 'TaskPilot AI Executive Weekly Summary & Release Readiness',
                    generatedAt: new Date().toISOString(),
                    teamProductivityScore: 91.2,
                    sprintVelocityTrend: 'Upward (+14% WoW)',
                    keyHighlights: [
                        'Seeding engine successfully initialized 100 users across 6 enterprise roles and 5,000 tasks.',
                        'AI Service Layer operating with 99.8% cache hit efficiency on common engineering queries.',
                    ],
                    releaseReadiness: 'READY_FOR_EXPLORATORY_QA',
                };
            case 'rag-chat':
            case 'assistant-chat':
            default:
                return {
                    reply: `**TaskPilot AI Assistant**: Regarding "${lastUserMsg}" — our system architecture enforces strict role separation across Admin, PM, Developer, QA, Product Owner, and Viewer roles. All tasks and sprints are monitored in real-time.`,
                    citations: [
                        { docTitle: 'TaskPilot AI Enterprise Architecture Spec v1.2', chunkIndex: 1, score: 0.94 },
                        { docTitle: 'Security & RBAC Policies Guide', chunkIndex: 0, score: 0.89 },
                    ],
                };
        }
    }
};
exports.OpenAiClientService = OpenAiClientService;
exports.OpenAiClientService = OpenAiClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService,
        logger_service_1.LoggerService])
], OpenAiClientService);
//# sourceMappingURL=openai-client.service.js.map