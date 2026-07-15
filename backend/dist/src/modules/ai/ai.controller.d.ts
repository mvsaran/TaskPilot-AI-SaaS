import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateTasks(body: {
        prompt: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    planSprint(body: {
        prompt: string;
        projectId: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    generateStory(body: {
        prompt: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    summarizeBug(body: {
        logs: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    predictRisk(body: {
        projectContext: string;
        projectId: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    summarizeMeeting(body: {
        transcript: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    smartSearch(body: {
        query: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    generateReport(body: {
        timeframe: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    ragChat(body: {
        question: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
    assistantChat(body: {
        message: string;
        projectId?: string;
    }, user: any): Promise<{
        fromCache: boolean;
        templateVersion: string;
        result: any;
        citations?: undefined;
    } | {
        fromCache: boolean;
        templateVersion: string;
        citations: any[];
        result: any;
    }>;
}
