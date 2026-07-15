import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TaskStatus, Priority } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List tasks with filtering by project, sprint, assignee, or status' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'sprintId', required: false, type: String })
  @ApiQuery({ name: 'assigneeId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'priority', required: false, enum: Priority })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: any) {
    return this.tasksService.findAll(query);
  }

  @Get('epics/:projectId')
  @ApiOperation({ summary: 'List epics for a specific project' })
  async getEpics(@Param('projectId') projectId: string) {
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

  @Get('stories/:epicId')
  @ApiOperation({ summary: 'List stories for a specific epic' })
  async getStories(@Param('epicId') epicId: string) {
    return this.prisma.story.findMany({
      where: { epicId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full task details including subtasks, comments, and activity timeline' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task under a story or sprint' })
  async create(@Body() body: any, @CurrentUser() user: any) {
    return this.tasksService.create(body, user?.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status (drag-and-drop Kanban transition)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @CurrentUser() user: any,
    @Headers('if-match') ifMatch?: string,
  ) {
    return this.tasksService.updateStatus(id, status, user?.id, ifMatch);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task metadata (assignee, estimate, priority)' })
  async update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.tasksService.update(id, body, user?.id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task with @mentions parsing' })
  async addComment(
    @Param('id') taskId: string,
    @Body('content') content: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.addComment(taskId, content, user?.id);
  }

  @Post(':id/subtasks')
  @ApiOperation({ summary: 'Create a checklist subtask' })
  async createSubtask(
    @Param('id') taskId: string,
    @Body() body: { title: string; assigneeId?: string },
  ) {
    return this.tasksService.createSubtask(taskId, body.title, body.assigneeId);
  }

  @Patch('subtasks/:subtaskId/toggle')
  @ApiOperation({ summary: 'Toggle subtask completion state' })
  async toggleSubtask(
    @Param('subtaskId') subtaskId: string,
    @Body('isCompleted') isCompleted: boolean,
  ) {
    return this.tasksService.toggleSubtask(subtaskId, isCompleted);
  }
}
