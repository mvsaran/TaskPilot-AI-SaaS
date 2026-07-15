import { PrismaService } from '../../prisma/prisma.service';
export declare class MetricsService {
    private readonly prisma;
    private requestCounts;
    private latencyHistory;
    constructor(prisma: PrismaService);
    recordRequest(endpoint: string, latencyMs: number): void;
    recordAiTokenUsage(params: {
        userId?: string;
        endpoint: string;
        model: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        estimatedCostUSD: number;
    }): Promise<void>;
    getStats(): {
        totalRequests: number;
        avgLatencyMs: number;
        endpointBreakdown: {
            [k: string]: number;
        };
    };
}
