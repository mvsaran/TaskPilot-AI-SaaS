import { Test, TestingModule } from '@nestjs/testing';
import { ResponseParserService } from './response-parser.service';
import { LoggerService } from '../../../common/services/logger.service';
import { BadRequestException } from '@nestjs/common';

describe('ResponseParserService', () => {
  let service: ResponseParserService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseParserService,
        {
          provide: LoggerService,
          useValue: {
            warn: jest.fn(),
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResponseParserService>(ResponseParserService);
    logger = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseAndValidate', () => {
    it('should throw BadRequestException when output is empty or null', () => {
      expect(() => service.parseAndValidate(null)).toThrow(BadRequestException);
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
