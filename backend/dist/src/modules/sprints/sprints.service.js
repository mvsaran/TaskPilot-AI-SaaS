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
exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_service_1 = require("../../common/services/audit.service");
let SprintsService = class SprintsService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findByProject(projectId) {
        return this.prisma.sprint.findMany({
            where: { projectId },
            include: {
                _count: { select: { tasks: true } },
            },
            orderBy: { startDate: 'desc' },
        });
    }
    async findOne(id) {
        const sprint = await this.prisma.sprint.findUnique({
            where: { id },
            include: {
                project: { select: { id: true, key: true, name: true } },
                tasks: {
                    include: {
                        assignee: { select: { id: true, fullName: true, avatarUrl: true } },
                        subtasks: true,
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!sprint) {
            throw new common_1.NotFoundException(`Sprint with ID ${id} not found`);
        }
        return sprint;
    }
    async create(data) {
        return this.prisma.sprint.create({
            data: {
                name: data.name,
                goal: data.goal,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: client_1.SprintStatus.PLANNED,
                projectId: data.projectId,
            },
        });
    }
    async startSprint(id, userId) {
        const sprint = await this.findOne(id);
        if (sprint.status === client_1.SprintStatus.ACTIVE) {
            throw new common_1.BadRequestException('Sprint is already active');
        }
        // Deactivate any currently active sprint for this project
        await this.prisma.sprint.updateMany({
            where: { projectId: sprint.projectId, status: client_1.SprintStatus.ACTIVE },
            data: { status: client_1.SprintStatus.CLOSED },
        });
        const updated = await this.prisma.sprint.update({
            where: { id },
            data: { status: client_1.SprintStatus.ACTIVE },
        });
        await this.audit.logAction({
            userId,
            action: 'START_SPRINT',
            resource: 'Sprint',
            resourceId: id,
            details: { name: updated.name },
        });
        return updated;
    }
    async closeSprint(id, userId) {
        const sprint = await this.findOne(id);
        if (sprint.status === client_1.SprintStatus.CLOSED) {
            throw new common_1.BadRequestException('Sprint is already closed');
        }
        // BUG-BE-02 intentional defect: Concurrent sprint closure does not lock carry-over task processing inside a serialized database transaction
        let completedPoints = 0;
        const carryOverTasks = [];
        for (const task of sprint.tasks) {
            if (task.status === 'DONE') {
                completedPoints += task.storyPoints || 0;
            }
            else {
                carryOverTasks.push(task.id);
                // Move incomplete tasks back to backlog / next active sprint
                await this.prisma.task.update({
                    where: { id: task.id },
                    data: { sprintId: null, status: 'TODO' },
                });
            }
        }
        const updated = await this.prisma.sprint.update({
            where: { id },
            data: {
                status: client_1.SprintStatus.CLOSED,
                velocity: completedPoints,
            },
        });
        await this.audit.logAction({
            userId,
            action: 'CLOSE_SPRINT',
            resource: 'Sprint',
            resourceId: id,
            details: { velocity: completedPoints, carryOverCount: carryOverTasks.length },
        });
        return updated;
    }
    async getBurndownData(id) {
        const sprint = await this.findOne(id);
        const totalPoints = sprint.tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
        const days = Math.max(1, Math.ceil((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 3600 * 24)));
        const burndown = [];
        const idealStep = totalPoints / days;
        let actualRemaining = totalPoints;
        for (let i = 0; i <= days; i++) {
            const date = new Date(sprint.startDate.getTime() + i * 86400000);
            // Simulate historical burn progression
            const completedOnDay = sprint.tasks
                .filter(t => t.status === 'DONE' && t.updatedAt <= date && t.updatedAt >= sprint.startDate)
                .reduce((acc, t) => acc + (t.storyPoints || 0), 0);
            actualRemaining = Math.max(0, totalPoints - completedOnDay);
            burndown.push({
                day: `Day ${i + 1}`,
                date: date.toISOString().split('T')[0],
                ideal: Math.max(0, Math.round(totalPoints - i * idealStep)),
                actual: Math.round(actualRemaining),
            });
        }
        return {
            sprintId: id,
            sprintName: sprint.name,
            totalPoints,
            burndown,
        };
    }
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map