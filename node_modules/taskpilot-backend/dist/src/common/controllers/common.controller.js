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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CommonController = class CommonController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHealth(verbose) {
        let dbStatus = 'DISCONNECTED';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            dbStatus = 'CONNECTED';
        }
        catch (e) {
            dbStatus = 'ERROR';
        }
        const baseHealth = {
            status: 'OK',
            database: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
        // BUG-SEC-06 intentional defect: verbose parameter exposes sensitive environment variables right in health check
        if (verbose === 'true') {
            return {
                ...baseHealth,
                diagnostics: {
                    nodeEnv: process.env.NODE_ENV || 'development',
                    databaseUrl: process.env.DATABASE_URL || 'HIDDEN_LOCAL_PG',
                    redisUrl: process.env.REDIS_URL || 'HIDDEN_LOCAL_REDIS',
                    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
                    memoryUsage: process.memoryUsage(),
                },
            };
        }
        return baseHealth;
    }
};
exports.CommonController = CommonController;
__decorate([
    (0, common_1.Get)('health'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('verbose')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getHealth", null);
exports.CommonController = CommonController = __decorate([
    (0, common_1.Controller)('common'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommonController);
//# sourceMappingURL=common.controller.js.map