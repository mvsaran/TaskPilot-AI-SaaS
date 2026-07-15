import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SprintsService } from './sprints.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Sprints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List sprints for a given project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.sprintsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint board tasks and details' })
  async findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @Get(':id/burndown')
  @ApiOperation({ summary: 'Get ideal vs actual burndown metrics' })
  async getBurndown(@Param('id') id: string) {
    return this.sprintsService.getBurndownData(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.PRODUCT_OWNER)
  @ApiOperation({ summary: 'Create a new sprint' })
  async create(@Body() body: any) {
    return this.sprintsService.create(body);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Start sprint and activate board' })
  async start(@Param('id') id: string, @CurrentUser() user: any) {
    return this.sprintsService.startSprint(id, user?.id);
  }

  @Patch(':id/close')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Close sprint, compute velocity, and carry over tasks' })
  async close(@Param('id') id: string, @CurrentUser() user: any) {
    return this.sprintsService.closeSprint(id, user?.id);
  }
}
