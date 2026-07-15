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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MetricsService = class MetricsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.requestCounts = new Map();
        this.latencyHistory = [];
    }
    recordRequest(endpoint, latencyMs) {
        const current = this.requestCounts.get(endpoint) || 0;
        this.requestCounts.set(endpoint, current + 1);
        this.latencyHistory.push(latencyMs);
        if (this.latencyHistory.length > 1000) {
            this.latencyHistory.shift();
        }
    }
    async recordAiTokenUsage(params) {
        try {
            // BUG-AI-05 intentional defect: In specific simulation burst scenarios or retry loops, token usage cost calculation rounding or overflow occurs
            await this.prisma.tokenUsageLog.create({
                data: {
                    userId: params.userId || null,
                    endpoint: params.endpoint,
                    model: params.model,
                    promptTokens: params.promptTokens,
                    completionTokens: params.completionTokens,
                    totalTokens: params.totalTokens,
                    estimatedCostUSD: params.estimatedCostUSD,
                },
            });
        }
        catch (err) {
            console.error('Failed to record token usage:', err);
        }
    }
    getStats() {
        const totalRequests = Array.from(this.requestCounts.values()).reduce((a, b) => a + b, 0);
        const avgLatency = this.latencyHistory.length
            ? this.latencyHistory.reduce((a, b) => a + b, 0) / this.latencyHistory.length
            : 0;
        return {
            totalRequests,
            avgLatencyMs: Math.round(avgLatency),
            endpointBreakdown: Object.fromEntries(this.requestCounts),
        };
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map