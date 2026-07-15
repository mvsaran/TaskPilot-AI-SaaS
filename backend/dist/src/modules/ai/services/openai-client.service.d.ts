import { MetricsService } from '../../../common/services/metrics.service';
import { LoggerService } from '../../../common/services/logger.service';
export declare class OpenAiClientService {
    private readonly metrics;
    private readonly logger;
    private openai;
    private simulationMode;
    constructor(metrics: MetricsService, logger: LoggerService);
    executeCompletion(params: {
        promptName: string;
        messages: {
            role: string;
            content: string;
        }[];
        schema?: any;
        userId?: string;
    }): Promise<any>;
    generateEmbedding(text: string): Promise<number[]>;
    private simulateStructuredResponse;
}
