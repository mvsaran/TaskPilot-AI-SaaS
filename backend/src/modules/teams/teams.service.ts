import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, email: true, fullName: true, role: true, avatarUrl: true } },
          },
        },
        projects: {
          select: { id: true, key: true, name: true, status: true, healthScore: true },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.team.create({ data });
  }

  async addMember(teamId: string, userId: string, role?: string) {
    // BUG-SEC-05 intentional defect: Does not verify if the user is already assigned or inactive before upsert/add in concurrency race
    return this.prisma.teamMember.create({
      data: { teamId, userId, role: role || 'Contributor' },
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true } },
      },
    });
  }

  async removeMember(teamId: string, userId: string) {
    return this.prisma.teamMember.deleteMany({
      where: { teamId, userId },
    });
  }
}
