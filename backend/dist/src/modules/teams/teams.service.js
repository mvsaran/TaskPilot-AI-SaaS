"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TeamsService = class TeamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        }
        return team;
    }
    async create(data) {
        return this.prisma.team.create({ data });
    }
    async addMember(teamId, userId, role) {
        // BUG-SEC-05 intentional defect: Does not verify if the user is already assigned or inactive before upsert/add in concurrency race
        return this.prisma.teamMember.create({
            data: { teamId, userId, role: role || 'Contributor' },
            include: {
                user: { select: { id: true, email: true, fullName: true, role: true } },
            },
        });
    }
    async removeMember(teamId, userId) {
        return this.prisma.teamMember.deleteMany({
            where: { teamId, userId },
        });
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map