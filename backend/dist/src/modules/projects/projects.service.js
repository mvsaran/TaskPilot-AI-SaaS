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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../common/services/audit.service");
let ProjectsService = class ProjectsService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async findAll(status, teamId, ownerId) {
        const where = {};
        if (status)
            where.status = status;
        if (teamId)
            where.teamId = teamId;
        if (ownerId)
            where.ownerId = ownerId;
        return this.prisma.project.findMany({
            where,
            include: {
                owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
                team: { select: { id: true, name: true } },
                _count: {
                    select: { epics: true, sprints: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
                team: { select: { id: true, name: true, description: true } },
                epics: {
                    include: {
                        _count: { select: { stories: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                sprints: {
                    orderBy: { startDate: 'desc' },
                    take: 10,
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async create(data) {
        const existing = await this.prisma.project.findUnique({ where: { key: data.key } });
        if (existing) {
            throw new common_1.BadRequestException(`Project key ${data.key} is already in use`);
        }
        const project = await this.prisma.project.create({
            data: {
                key: data.key.toUpperCase(),
                name: data.name,
                description: data.description,
                ownerId: data.ownerId,
                teamId: data.teamId || null,
                healthScore: 100.0,
                riskFactors: JSON.stringify([]),
            },
        });
        await this.audit.logAction({
            userId: data.ownerId,
            action: 'CREATE_PROJECT',
            resource: 'Project',
            resourceId: project.id,
            details: { key: project.key, name: project.name },
        });
        return project;
    }
    async update(id, data, userId) {
        const updated = await this.prisma.project.update({
            where: { id },
            data: {
                ...data,
                riskFactors: data.riskFactors ? JSON.stringify(data.riskFactors) : undefined,
            },
        });
        await this.audit.logAction({
            userId: userId || updated.ownerId,
            action: 'UPDATE_PROJECT',
            resource: 'Project',
            resourceId: updated.id,
            details: data,
        });
        return updated;
    }
    async getHealthMetrics(id) {
        const project = await this.findOne(id);
        const activeSprint = await this.prisma.sprint.findFirst({
            where: { projectId: id, status: 'ACTIVE' },
            include: {
                tasks: { select: { id: true, status: true, storyPoints: true, estimatedHours: true, loggedHours: true } }
            }
        });
        let completedPoints = 0;
        let totalPoints = 0;
        if (activeSprint) {
            for (const t of activeSprint.tasks) {
                const pts = t.storyPoints || 0;
                totalPoints += pts;
                if (t.status === 'DONE') {
                    completedPoints += pts;
                }
            }
        }
        return {
            projectId: id,
            key: project.key,
            name: project.name,
            healthScore: project.healthScore,
            riskFactors: typeof project.riskFactors === 'string' ? JSON.parse(project.riskFactors) : project.riskFactors,
            activeSprint: activeSprint ? {
                id: activeSprint.id,
                name: activeSprint.name,
                velocity: activeSprint.velocity,
                completionRate: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
            } : null,
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map