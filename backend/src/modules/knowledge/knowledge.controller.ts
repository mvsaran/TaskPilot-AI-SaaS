import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Knowledge & RAG')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  @ApiOperation({ summary: 'List knowledge documents' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async findAll(@Query('projectId') projectId?: string) {
    return this.knowledgeService.findAll(projectId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Test vector similarity search with citations over indexed chunks' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'topK', required: false, type: Number })
  async search(
    @Query('query') query: string,
    @Query('projectId') projectId?: string,
    @Query('topK') topK: number = 3,
  ) {
    return this.knowledgeService.testSearch(query, projectId, Number(topK));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document and indexed chunks' })
  async findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER)
  @ApiOperation({ summary: 'Upload a new knowledge base document (triggers async chunking & vector embedding)' })
  async create(
    @Body() body: { title: string; fileName: string; fileType: string; content: string; projectId?: string },
    @CurrentUser() user: any,
  ) {
    return this.knowledgeService.createDocument({
      ...body,
      uploaderId: user?.id || 'admin-system-id',
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Delete knowledge document and vector chunks' })
  async delete(@Param('id') id: string) {
    return this.knowledgeService.deleteDocument(id);
  }
}
