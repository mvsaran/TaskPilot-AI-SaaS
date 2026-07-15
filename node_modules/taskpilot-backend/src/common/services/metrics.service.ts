import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MetricsService {
  private requestCounts: Map<string, number> = new Map();
  private latencyHistory: number[] = [];

  constructor(private readonly prisma: PrismaService) {}

  recordRequest(endpoint: string, latencyMs: number) {
    const current = this.requestCounts.get(endpoint) || 0;
    this.requestCounts.set(endpoint, current + 1);
    this.latencyHistory.push(latencyMs);
    if (this.latencyHistory.length > 1000) {
      this.latencyHistory.shift();
    }
  }

  async recordAiTokenUsage(params: {
    userId?: string;
    endpoint: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUSD: number;
  }): Promise<void> {
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
    } catch (err) {
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
}
