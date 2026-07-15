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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExecutiveDashboard(teamId) {
        const projectFilter = teamId ? { teamId } : {};
        const [projects, totalTasks, completedTasks, activeSprints, auditCount] = await Promise.all([
            this.prisma.project.findMany({
                where: projectFilter,
                select: { id: true, key: true, name: true, status: true, healthScore: true },
            }),
            this.prisma.task.count({ where: teamId ? { story: { epic: { project: { teamId } } } } : {} }),
            this.prisma.task.count({ where: { status: client_1.TaskStatus.DONE, ...(teamId ? { story: { epic: { project: { teamId } } } } : {}) } }),
            this.prisma.sprint.count({ where: { status: 'ACTIVE', ...(teamId ? { project: { teamId } } : {}) } }),
            this.prisma.auditLog.count(),
        ]);
        const averageHealth = projects.length > 0
            ? projects.reduce((acc, p) => acc + p.healthScore, 0) / projects.length
            : 100;
        return {
            summary: {
                totalProjects: projects.length,
                activeProjects: projects.filter(p => p.status === client_1.ProjectStatus.ACTIVE).length,
                totalTasks,
                completedTasks,
                completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                activeSprints,
                averageHealthScore: Number(averageHealth.toFixed(1)),
                totalAuditLogs: auditCount,
            },
            projects,
            releaseReadiness: averageHealth >= 85 ? 'HIGH_CONFIDENCE' : averageHealth >= 70 ? 'MODERATE_CONFIDENCE' : 'AT_RISK',
        };
    }
    async getVelocityChart(projectId) {
        const sprints = await this.prisma.sprint.findMany({
            where: { projectId, status: 'CLOSED' },
            orderBy: { endDate: 'asc' },
            take: 10,
        });
        return sprints.map(s => ({
            sprintId: s.id,
            name: s.name,
            velocity: s.velocity || 0,
            targetPoints: 40,
        }));
    }
    async getTaskDistribution(projectId) {
        const filter = projectId ? { story: { epic: { projectId } } } : {};
        const [todo, inProgress, inReview, done] = await Promise.all([
            this.prisma.task.count({ where: { ...filter, status: client_1.TaskStatus.TODO } }),
            this.prisma.task.count({ where: { ...filter, status: client_1.TaskStatus.IN_PROGRESS } }),
            this.prisma.task.count({ where: { ...filter, status: client_1.TaskStatus.IN_REVIEW } }),
            this.prisma.task.count({ where: { ...filter, status: client_1.TaskStatus.DONE } }),
        ]);
        return {
            TODO: todo,
            IN_PROGRESS: inProgress,
            IN_REVIEW: inReview,
            DONE: done,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map