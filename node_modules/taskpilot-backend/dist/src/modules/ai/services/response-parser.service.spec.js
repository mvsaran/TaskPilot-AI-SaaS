"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const response_parser_service_1 = require("./response-parser.service");
const logger_service_1 = require("../../../common/services/logger.service");
const common_1 = require("@nestjs/common");
describe('ResponseParserService', () => {
    let service;
    let logger;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                response_parser_service_1.ResponseParserService,
                {
                    provide: logger_service_1.LoggerService,
                    useValue: {
                        warn: jest.fn(),
                        info: jest.fn(),
                        error: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(response_parser_service_1.ResponseParserService);
        logger = module.get(logger_service_1.LoggerService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('parseAndValidate', () => {
        it('should throw BadRequestException when output is empty or null', () => {
            expect(() => service.parseAndValidate(null)).toThrow(common_1.BadRequestException);
        });
        it('should normalize and return object if rawOutput is already an object', () => {
            const obj = { Title: 'Fix Bug', storyPoints: 5 };
            const res = service.parseAndValidate(obj);
            expect(res).toEqual({ Title: 'Fix Bug', storyPoints: 5 });
        });
        it('should extract and parse JSON from inside markdown ```json fence', () => {
            const markdownOutput = `Here is your result:
\`\`\`json
{
  "tasks": [
    { "title": "Setup OAuth", "priority": "HIGH" }
  ]
}
\`\`\``;
            const res = service.parseAndValidate(markdownOutput);
            expect(res).toHaveProperty('tasks');
            expect(res.tasks[0].title).toBe('Setup OAuth');
        });
        it('should fallback to raw/text wrapping when JSON parse fails (BUG-AI-06 recovery behavior)', () => {
            const malformedJson = `{"invalid": "json", }`;
            const res = service.parseAndValidate(malformedJson);
            expect(res).toEqual({ raw: malformedJson, text: malformedJson });
            expect(logger.warn).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=response-parser.service.spec.js.map