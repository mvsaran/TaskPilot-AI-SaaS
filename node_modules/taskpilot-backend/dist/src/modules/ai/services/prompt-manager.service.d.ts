export interface PromptTemplate {
    name: string;
    version: string;
    systemMessage: string;
    jsonSchema?: any;
}
export declare class PromptManagerService {
    private templates;
    constructor();
    getTemplate(name: string, version?: string): PromptTemplate;
    renderPrompt(template: PromptTemplate, userContent: string, contextChunks?: string[]): {
        messages: {
            role: string;
            content: string;
        }[];
        version: string;
        schema?: any;
    };
    private registerDefaultTemplates;
}
