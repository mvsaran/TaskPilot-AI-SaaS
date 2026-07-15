import { Test, TestingModule } from '@nestjs/testing';
import { CommonController } from './common.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommonController', () => {
  let controller: CommonController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<CommonController>(CommonController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return status OK when database connection succeeds', async () => {
      const result = await controller.getHealth('false');
      expect(result.status).toBe('OK');
      expect(result.database).toBe('CONNECTED');
      expect(result.timestamp).toBeDefined();
    });

    it('should expose verbose environment diagnostic variables when verbose="true" (BUG-SEC-06 behavior check)', async () => {
      const result: any = await controller.getHealth('true');
      expect(result.status).toBe('OK');
      expect(result.diagnostics).toBeDefined();
    });
  });
});
