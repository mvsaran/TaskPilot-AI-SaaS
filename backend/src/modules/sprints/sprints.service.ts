import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SprintStatus } from '@prisma/client';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class SprintsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findByProject(projectId: string) {
    return this.prisma.sprint.findMany({
      where: { projectId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async create(data: {
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
    projectId: string;
  }) {
    return this.prisma.sprint.create({
      data: {
        name: data.name,
        goal: data.goal,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: SprintStatus.PLANNED,
        projectId: data.projectId,
      },
    });
  }

  async startSprint(id: string, userId?: string) {
    const sprint = await this.findOne(id);
    if (sprint.status === SprintStatus.ACTIVE) {
      throw new BadRequestException('Sprint is already active');
    }

    // Deactivate any currently active sprint for this project
    await this.prisma.sprint.updateMany({
      where: { projectId: sprint.projectId, status: SprintStatus.ACTIVE },
      data: { status: SprintStatus.CLOSED },
    });

    const updated = await this.prisma.sprint.update({
      where: { id },
      data: { status: SprintStatus.ACTIVE },
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

  async closeSprint(id: string, userId?: string) {
    const sprint = await this.findOne(id);
    if (sprint.status === SprintStatus.CLOSED) {
      throw new BadRequestException('Sprint is already closed');
    }

    // BUG-BE-02 intentional defect: Concurrent sprint closure does not lock carry-over task processing inside a serialized database transaction
    let completedPoints = 0;
    const carryOverTasks: string[] = [];

    for (const task of sprint.tasks) {
      if (task.status === 'DONE') {
        completedPoints += task.storyPoints || 0;
      } else {
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
        status: SprintStatus.CLOSED,
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

  async getBurndownData(id: string) {
    const sprint = await this.findOne(id);
    const totalPoints = sprint.tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
    const days = Math.max(1, Math.ceil((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 3600 * 24)));
    
    const burndown: any[] = [];
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
}
