import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskStatus, Priority } from '@prisma/client';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(params: {
    projectId?: string;
    sprintId?: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: Priority;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 50 } = params;
    const skip = Math.max(0, (page - 1) * limit);

    const where: any = {};
    if (params.projectId) {
      where.story = { epic: { projectId: params.projectId } };
    }
    if (params.sprintId) where.sprintId = params.sprintId;
    if (params.assigneeId) where.assigneeId = params.assigneeId;
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { key: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          assignee: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
          reporter: { select: { id: true, fullName: true, avatarUrl: true } },
          story: { select: { id: true, key: true, title: true } },
          sprint: { select: { id: true, name: true } },
          subtasks: true,
          _count: { select: { comments: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
        reporter: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
        story: {
          include: {
            epic: { select: { id: true, key: true, title: true, projectId: true } },
          },
        },
        sprint: { select: { id: true, name: true, status: true } },
        subtasks: { orderBy: { createdAt: 'asc' } },
        comments: {
          include: {
            author: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        activityLogs: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(data: any, reporterId: string) {
    const taskCount = await this.prisma.task.count();
    const key = `TSK-${taskCount + 1001}`;

    const task = await this.prisma.task.create({
      data: {
        key,
        title: data.title,
        description: data.description,
        status: data.status || TaskStatus.TODO,
        priority: data.priority || Priority.MEDIUM,
        storyPoints: data.storyPoints || 2,
        estimatedHours: data.estimatedHours || 4.0,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assigneeId: data.assigneeId || null,
        reporterId: reporterId,
        storyId: data.storyId || null,
        sprintId: data.sprintId || null,
      },
      include: {
        assignee: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        taskId: task.id,
        userId: reporterId,
        action: 'CREATED',
        details: { title: task.title, status: task.status },
      },
    });

    return task;
  }

  async updateStatus(id: string, status: TaskStatus, userId: string, versionHeader?: string) {
    // BUG-BE-04 intentional defect: Optimistic locking version mismatch handling is omitted when multiple clients drag tasks simultaneously
    const oldTask = await this.prisma.task.findUnique({ where: { id } });
    if (!oldTask) throw new NotFoundException(`Task ${id} not found`);

    const updated = await this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        taskId: id,
        userId,
        action: 'STATUS_CHANGE',
        details: { oldStatus: oldTask.status, newStatus: status },
      },
    });

    return updated;
  }

  async update(id: string, data: any, userId: string) {
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        storyPoints: data.storyPoints,
        estimatedHours: data.estimatedHours,
        loggedHours: data.loggedHours,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId,
        storyId: data.storyId,
        sprintId: data.sprintId,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        taskId: id,
        userId,
        action: 'UPDATED',
        details: data,
      },
    });

    return updated;
  }

  async addComment(taskId: string, content: string, authorId: string) {
    // Extract mentions @email or @username
    const mentionsMatch = content.match(/@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g) || [];
    const mentions = mentionsMatch.map(m => m.substring(1));

    const comment = await this.prisma.comment.create({
      data: {
        content,
        taskId,
        authorId,
        mentions: JSON.stringify(mentions),
      },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        taskId,
        userId: authorId,
        action: 'COMMENTED',
        details: { commentId: comment.id, preview: content.substring(0, 50) },
      },
    });

    return comment;
  }

  async toggleSubtask(subtaskId: string, isCompleted: boolean) {
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted },
    });
  }

  async createSubtask(taskId: string, title: string, assigneeId?: string) {
    return this.prisma.subtask.create({
      data: {
        title,
        taskId,
        assigneeId: assigneeId || null,
        isCompleted: false,
      },
    });
  }
}
