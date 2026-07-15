import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'List all enterprise teams' })
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a team including members and projects' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Create a new team (Admin/PM only)' })
  async create(@Body() body: { name: string; description?: string }) {
    return this.teamsService.create(body);
  }

  @Post(':id/members')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Add a member to a team' })
  async addMember(
    @Param('id') teamId: string,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.teamsService.addMember(teamId, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Remove a member from a team' })
  async removeMember(@Param('id') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(teamId, userId);
  }
}
