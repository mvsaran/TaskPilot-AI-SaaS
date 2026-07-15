import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectStatus } from '@prisma/client';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(status?: ProjectStatus, teamId?: string, ownerId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (teamId) where.teamId = teamId;
    if (ownerId) where.ownerId = ownerId;

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

  async findOne(id: string) {
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
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(data: {
    key: string;
    name: string;
    description?: string;
    ownerId: string;
    teamId?: string;
  }) {
    const existing = await this.prisma.project.findUnique({ where: { key: data.key } });
    if (existing) {
      throw new BadRequestException(`Project key ${data.key} is already in use`);
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

  async update(id: string, data: Partial<{ name: string; description: string; status: ProjectStatus; healthScore: number; riskFactors: any }>, userId?: string) {
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

  async getHealthMetrics(id: string) {
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
}
