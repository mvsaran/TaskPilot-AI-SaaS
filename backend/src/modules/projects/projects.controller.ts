import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProjectStatus, UserRole } from '@prisma/client';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List enterprise projects with filtering' })
  @ApiQuery({ name: 'status', required: false, enum: ProjectStatus })
  @ApiQuery({ name: 'teamId', required: false, type: String })
  @ApiQuery({ name: 'ownerId', required: false, type: String })
  async findAll(
    @Query('status') status?: ProjectStatus,
    @Query('teamId') teamId?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    return this.projectsService.findAll(status, teamId, ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details, active sprints, and epics' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/health')
  @ApiOperation({ summary: 'Get real-time AI health metrics and completion rate' })
  async getHealthMetrics(@Param('id') id: string) {
    return this.projectsService.getHealthMetrics(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Create a new project (Admin/PM only)' })
  async create(
    @Body() body: { key: string; name: string; description?: string; teamId?: string },
    @CurrentUser() user: any,
  ) {
    return this.projectsService.create({
      ...body,
      ownerId: user.id,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Update project details or status' })
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.update(id, body, user.id);
  }
}
