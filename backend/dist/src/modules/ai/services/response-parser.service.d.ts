import { LoggerService } from '../../../common/services/logger.service';
export declare class ResponseParserService {
    private readonly logger;
    constructor(logger: LoggerService);
    parseAndValidate(rawOutput: any, expectedSchema?: any): any;
    private normalizeKeys;
}
