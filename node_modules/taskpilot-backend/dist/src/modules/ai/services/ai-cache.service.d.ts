export declare class AiCacheService {
    private memoryCache;
    generateCacheKey(promptName: string, promptText: string, version: string, projectId?: string): string;
    get(key: string): Promise<any | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
}
