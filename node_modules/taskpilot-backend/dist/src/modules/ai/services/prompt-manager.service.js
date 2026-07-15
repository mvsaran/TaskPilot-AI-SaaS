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
exports.PromptManagerService = void 0;
const common_1 = require("@nestjs/common");
let PromptManagerService = class PromptManagerService {
    constructor() {
        this.templates = new Map();
        this.registerDefaultTemplates();
    }
    getTemplate(name, version) {
        const key = version ? `${name}:${version}` : `${name}:latest`;
        const template = this.templates.get(key) || this.templates.get(`${name}:latest`);
        if (!template) {
            throw new Error(`Prompt template '${name}' not found.`);
        }
        return template;
    }
    renderPrompt(template, userContent, contextChunks) {
        let combinedInput = userContent;
        if (contextChunks && contextChunks.length > 0) {
            const citationsText = contextChunks
                .map((chunk, i) => `[Citation #${i + 1}] ${chunk}`)
                .join('\n\n');
            combinedInput = `${userContent}\n\n### Retrieved Knowledge Base Context:\n${citationsText}`;
        }
        // BUG-AI-01 intentional defect: Truncates user input hard at 8192 characters without preserving recent context or warning the caller
        if (combinedInput.length > 8192) {
            combinedInput = combinedInput.substring(0, 8192);
        }
        return {
            messages: [
                { role: 'system', content: template.systemMessage },
                { role: 'user', content: combinedInput },
            ],
            version: template.version,
            schema: template.jsonSchema,
        };
    }
    registerDefaultTemplates() {
        // 1. Task Generator
        this.templates.set('task-generator:latest', {
            name: 'task-generator',
            version: 'v1.2.0',
            systemMessage: `You are an enterprise AI Project Manager. Given a feature idea or engineering request, break it down into an Epic, User Stories, tasks with story points, and clear Acceptance Criteria. Return ONLY valid JSON matching the exact schema provided.`,
            jsonSchema: {
                type: 'object',
                properties: {
                    epic: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            priority: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
                        },
                        required: ['title', 'description', 'priority'],
                    },
                    stories: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                storyPoints: { type: 'number' },
                                priority: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
                                acceptanceCriteria: { type: 'array', items: { type: 'string' } },
                                tasks: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            estimatedHours: { type: 'number' },
                                        },
                                        required: ['title', 'estimatedHours'],
                                    },
                                },
                            },
                            required: ['title', 'description', 'storyPoints', 'acceptanceCriteria', 'tasks'],
                        },
                    },
                },
                required: ['epic', 'stories'],
            },
        });
        // 2. Sprint Planner
        this.templates.set('sprint-planner:latest', {
            name: 'sprint-planner',
            version: 'v1.1.0',
            systemMessage: `You are an Agile Sprint Planning AI. Analyze the unassigned backlog tasks, target velocity, and team capacity. Recommend a balanced distribution of tasks, predicted completion rate, and workload warnings. Return strictly structured JSON.`,
        });
        // 3. Story Generator
        this.templates.set('story-generator:latest', {
            name: 'story-generator',
            version: 'v1.0.0',
            systemMessage: `You are a Senior Product Owner AI. Convert feature ideas into highly detailed user stories with Acceptance Criteria, Definition of Done, Edge Cases, and Risks. Return structured JSON.`,
        });
        // 4. Bug Summarizer
        this.templates.set('bug-summarizer:latest', {
            name: 'bug-summarizer',
            version: 'v1.3.0',
            systemMessage: `You are a Principal DevOps/Backend Engineer AI. Analyze the pasted log snippets or error trace. Explain the Root Cause, Severity rating, Suggested Fixes, and Related Architecture Modules. Return structured JSON.`,
        });
        // 5. Risk Predictor
        this.templates.set('risk-predictor:latest', {
            name: 'risk-predictor',
            version: 'v1.0.0',
            systemMessage: `You are a Risk Assessment AI engine. Analyze overdue tasks, blocked work items, historical velocity variance, and task dependencies. Predict overall project risk score and mitigation strategies. Return structured JSON.`,
        });
        // 6. Meeting Notes
        this.templates.set('meeting-notes:latest', {
            name: 'meeting-notes',
            version: 'v1.0.0',
            systemMessage: `You are an Executive AI Secretary. Analyze the meeting transcript. Summarize key discussion points, Decisions made, Action Items assigned to individuals, and Follow-ups needed. Return structured JSON.`,
        });
        // 7. Smart Search
        this.templates.set('smart-search:latest', {
            name: 'smart-search',
            version: 'v1.2.0',
            systemMessage: `You are an AI Natural Language to Database Query Translator for TaskPilot AI. Translate natural language queries (e.g. "Show overdue backend tasks assigned to Rahul") into exact filter parameters and SQL/Prisma query logic. Return structured JSON.`,
        });
        // 8. Report Generator
        this.templates.set('report-generator:latest', {
            name: 'report-generator',
            version: 'v1.1.0',
            systemMessage: `You are an Executive Report AI. Generate comprehensive weekly reports, sprint summaries, team productivity ratings, and release readiness briefings. Return structured JSON.`,
        });
        // 9. Knowledge Assistant (RAG Chat)
        this.templates.set('rag-chat:latest', {
            name: 'rag-chat',
            version: 'v2.0.0',
            systemMessage: `You are the TaskPilot AI Knowledge Base Assistant. Answer the user's project or architecture questions directly using ONLY the retrieved citations provided in context. If the answer is not in the citations, state what is known and cite the closest source. Always reference [Citation #X] in your response.`,
        });
        // 10. Built-in Chat Assistant
        this.templates.set('assistant-chat:latest', {
            name: 'assistant-chat',
            version: 'v1.0.0',
            systemMessage: `You are TaskPilot AI, an intelligent co-pilot built directly into this project management workspace. Help the user check project status, sprint progress, task ownership, and answer general software engineering questions clearly and concisely.`,
        });
    }
};
exports.PromptManagerService = PromptManagerService;
exports.PromptManagerService = PromptManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PromptManagerService);
//# sourceMappingURL=prompt-manager.service.js.map