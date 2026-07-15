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
exports.TasksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let TasksController = class TasksController {
    constructor(tasksService, prisma) {
        this.tasksService = tasksService;
        this.prisma = prisma;
    }
    async findAll(query) {
        return this.tasksService.findAll(query);
    }
    async getEpics(projectId) {
        return this.prisma.epic.findMany({
            where: { projectId },
            include: {
                stories: {
                    include: { _count: { select: { tasks: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStories(epicId) {
        return this.prisma.story.findMany({
            where: { epicId },
            include: { _count: { select: { tasks: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        return this.tasksService.findOne(id);
    }
    async create(body, user) {
        return this.tasksService.create(body, user?.id);
    }
    async updateStatus(id, status, user, ifMatch) {
        return this.tasksService.updateStatus(id, status, user?.id, ifMatch);
    }
    async update(id, body, user) {
        return this.tasksService.update(id, body, user?.id);
    }
    async addComment(taskId, content, user) {
        return this.tasksService.addComment(taskId, content, user?.id);
    }
    async createSubtask(taskId, body) {
        return this.tasksService.createSubtask(taskId, body.title, body.assigneeId);
    }
    async toggleSubtask(subtaskId, isCompleted) {
        return this.tasksService.toggleSubtask(subtaskId, isCompleted);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tasks with filtering by project, sprint, assignee, or status' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sprintId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'assigneeId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.TaskStatus }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false, enum: client_1.Priority }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('epics/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'List epics for a specific project' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getEpics", null);
__decorate([
    (0, common_1.Get)('stories/:epicId'),
    (0, swagger_1.ApiOperation)({ summary: 'List stories for a specific epic' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('epicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getStories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full task details including subtasks, comments, and activity timeline' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task under a story or sprint' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status (drag-and-drop Kanban transition)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Headers)('if-match')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task metadata (assignee, estimate, priority)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a task with @mentions parsing' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)(':id/subtasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a checklist subtask' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createSubtask", null);
__decorate([
    (0, common_1.Patch)('subtasks/:subtaskId/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle subtask completion state' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('subtaskId')),
    __param(1, (0, common_1.Body)('isCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "toggleSubtask", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService,
        prisma_service_1.PrismaService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map