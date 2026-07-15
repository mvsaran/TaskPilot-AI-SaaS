import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectStatus, TaskStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExecutiveDashboard(teamId?: string) {
    const projectFilter = teamId ? { teamId } : {};

    const [projects, totalTasks, completedTasks, activeSprints, auditCount] = await Promise.all([
      this.prisma.project.findMany({
        where: projectFilter,
        select: { id: true, key: true, name: true, status: true, healthScore: true },
      }),
      this.prisma.task.count({ where: teamId ? { story: { epic: { project: { teamId } } } } : {} }),
      this.prisma.task.count({ where: { status: TaskStatus.DONE, ...(teamId ? { story: { epic: { project: { teamId } } } } : {}) } }),
      this.prisma.sprint.count({ where: { status: 'ACTIVE', ...(teamId ? { project: { teamId } } : {}) } }),
      this.prisma.auditLog.count(),
    ]);

    const averageHealth = projects.length > 0
      ? projects.reduce((acc, p) => acc + p.healthScore, 0) / projects.length
      : 100;

    return {
      summary: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
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

  async getVelocityChart(projectId: string) {
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

  async getTaskDistribution(projectId?: string) {
    const filter = projectId ? { story: { epic: { projectId } } } : {};
    const [todo, inProgress, inReview, done] = await Promise.all([
      this.prisma.task.count({ where: { ...filter, status: TaskStatus.TODO } }),
      this.prisma.task.count({ where: { ...filter, status: TaskStatus.IN_PROGRESS } }),
      this.prisma.task.count({ where: { ...filter, status: TaskStatus.IN_REVIEW } }),
      this.prisma.task.count({ where: { ...filter, status: TaskStatus.DONE } }),
    ]);

    return {
      TODO: todo,
      IN_PROGRESS: inProgress,
      IN_REVIEW: inReview,
      DONE: done,
    };
  }
}
