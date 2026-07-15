import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Analytics & Reporting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get high-level executive dashboard metrics' })
  @ApiQuery({ name: 'teamId', required: false, type: String })
  async getDashboard(@Query('teamId') teamId?: string) {
    return this.analyticsService.getExecutiveDashboard(teamId);
  }

  @Get('velocity/:projectId')
  @ApiOperation({ summary: 'Get sprint velocity trends for a project' })
  async getVelocity(@Param('projectId') projectId: string) {
    return this.analyticsService.getVelocityChart(projectId);
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Get task status distribution counts across workspace or specific project' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async getDistribution(@Query('projectId') projectId?: string) {
    return this.analyticsService.getTaskDistribution(projectId);
  }
}
