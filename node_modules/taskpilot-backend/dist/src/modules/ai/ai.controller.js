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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateTasks(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'task-generator',
            userInput: body.prompt,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async planSprint(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'sprint-planner',
            userInput: body.prompt,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async generateStory(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'story-generator',
            userInput: body.prompt,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async summarizeBug(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'bug-summarizer',
            userInput: body.logs,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async predictRisk(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'risk-predictor',
            userInput: body.projectContext,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async summarizeMeeting(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'meeting-notes',
            userInput: body.transcript,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async smartSearch(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'smart-search',
            userInput: body.query,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async generateReport(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'report-generator',
            userInput: body.timeframe,
            projectId: body.projectId,
            userId: user?.id,
        });
    }
    async ragChat(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'rag-chat',
            userInput: body.question,
            projectId: body.projectId,
            useRag: true,
            userId: user?.id,
        });
    }
    async assistantChat(body, user) {
        return this.aiService.executeAiCapability({
            capabilityName: 'assistant-chat',
            userInput: body.message,
            projectId: body.projectId,
            useRag: true,
            userId: user?.id,
        });
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('task-generator'),
    (0, swagger_1.ApiOperation)({ summary: '1. AI Task & Epic Generator: Break down feature requests into structured stories & tasks' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateTasks", null);
__decorate([
    (0, common_1.Post)('sprint-planner'),
    (0, swagger_1.ApiOperation)({ summary: '2. AI Sprint Planner: Recommend task distribution, velocity prediction, and workload balance' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "planSprint", null);
__decorate([
    (0, common_1.Post)('story-generator'),
    (0, swagger_1.ApiOperation)({ summary: '3. AI User Story Generator: Generate detailed Acceptance Criteria, DoD, Edge Cases & Risks' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateStory", null);
__decorate([
    (0, common_1.Post)('summarize-bug'),
    (0, swagger_1.ApiOperation)({ summary: '4. AI Bug Summarizer: Analyze logs/stack traces to find Root Cause, Severity & Fixes' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarizeBug", null);
__decorate([
    (0, common_1.Post)('predict-risk'),
    (0, swagger_1.ApiOperation)({ summary: '5. AI Risk Prediction: Analyze overdue tasks, blockers, and velocity drop to predict risks' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "predictRisk", null);
__decorate([
    (0, common_1.Post)('meeting-notes'),
    (0, swagger_1.ApiOperation)({ summary: '6. AI Meeting Notes: Summarize transcripts, Decisions, Action Items & Follow-ups' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarizeMeeting", null);
__decorate([
    (0, common_1.Post)('smart-search'),
    (0, swagger_1.ApiOperation)({ summary: '7. AI Smart Search: Translate natural language queries to SQL/Prisma and execute' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "smartSearch", null);
__decorate([
    (0, common_1.Post)('generate-report'),
    (0, swagger_1.ApiOperation)({ summary: '8. AI Report Generator: Generate Weekly Reports, Sprint Summaries & Release Readiness' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Post)('rag-chat'),
    (0, swagger_1.ApiOperation)({ summary: '9. AI Knowledge Assistant: RAG-based answer generation with exact citations over pgvector docs' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "ragChat", null);
__decorate([
    (0, common_1.Post)('assistant-chat'),
    (0, swagger_1.ApiOperation)({ summary: '10. Built-in Project Assistant: Real-time conversational co-pilot for workspace guidance' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "assistantChat", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Hub & Copilot'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map