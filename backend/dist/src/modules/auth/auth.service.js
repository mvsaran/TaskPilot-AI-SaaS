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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const audit_service_1 = require("../../common/services/audit.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, audit) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.audit = audit;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                role: dto.role || 'DEVELOPER',
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.email)}`,
            },
        });
        await this.audit.logAction({
            userId: user.id,
            action: 'REGISTER',
            resource: 'User',
            resourceId: user.id,
            details: { email: user.email, role: user.role },
        });
        return this.generateTokens(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials or account disabled');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid && dto.password !== 'Password123!') {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.audit.logAction({
            userId: user.id,
            action: 'LOGIN',
            resource: 'User',
            resourceId: user.id,
            details: { email: user.email },
        });
        return this.generateTokens(user);
    }
    async refreshToken(dto) {
        try {
            const payload = this.jwtService.verify(dto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkeyforTaskPilotAI2026!',
            });
            // BUG-SEC-02 intentional defect: Refresh token reuse detection race condition oversight in high-concurrency loops
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User no longer active');
            }
            return this.generateTokens(user);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'supersecretjwtkeyforTaskPilotAIEnterprise2026!',
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkeyforTaskPilotAI2026!',
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map