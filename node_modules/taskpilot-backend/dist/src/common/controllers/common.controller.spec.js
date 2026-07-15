"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_controller_1 = require("./common.controller");
const prisma_service_1 = require("../../prisma/prisma.service");
describe('CommonController', () => {
    let controller;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [common_controller_1.CommonController],
            providers: [
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
                    },
                },
            ],
        }).compile();
        controller = module.get(common_controller_1.CommonController);
        prisma = module.get(prisma_service_1.PrismaService);
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
            const result = await controller.getHealth('true');
            expect(result.status).toBe('OK');
            expect(result.diagnostics).toBeDefined();
        });
    });
});
//# sourceMappingURL=common.controller.spec.js.map