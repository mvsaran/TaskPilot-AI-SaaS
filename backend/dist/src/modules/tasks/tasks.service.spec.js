"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tasks_service_1 = require("./tasks.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../common/services/audit.service");
const common_1 = require("@nestjs/common");
describe('TasksService', () => {
    let service;
    let prisma;
    let audit;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tasks_service_1.TasksService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        task: {
                            findMany: jest.fn(),
                            count: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                        },
                        subtask: {
                            createMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                        comment: {
                            create: jest.fn(),
                        },
                        activityLog: {
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: {
                        logAction: jest.fn().mockResolvedValue(true),
                    },
                },
            ],
        }).compile();
        service = module.get(tasks_service_1.TasksService);
        prisma = module.get(prisma_service_1.PrismaService);
        audit = module.get(audit_service_1.AuditService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        it('should return paginated tasks list', async () => {
            const mockTasks = [{ id: 'tsk-1', title: 'Task 1', status: 'TODO' }];
            prisma.task.findMany.mockResolvedValue(mockTasks);
            prisma.task.count.mockResolvedValue(1);
            const res = await service.findAll({ page: 1, limit: 10 });
            expect(res.data).toEqual(mockTasks);
            expect(res.meta.total).toBe(1);
        });
    });
    describe('findOne', () => {
        it('should return task details when found', async () => {
            const mockTask = { id: 'tsk-1', title: 'Task 1', subtasks: [], comments: [] };
            prisma.task.findUnique.mockResolvedValue(mockTask);
            const res = await service.findOne('tsk-1');
            expect(res).toEqual(mockTask);
        });
        it('should throw NotFoundException when task does not exist', async () => {
            prisma.task.findUnique.mockResolvedValue(null);
            await expect(service.findOne('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('updateStatus', () => {
        it('should update task status and log audit action', async () => {
            const existing = { id: 'tsk-1', title: 'Task 1', status: 'TODO' };
            const updated = { id: 'tsk-1', title: 'Task 1', status: 'DONE' };
            prisma.task.findUnique.mockResolvedValue(existing);
            prisma.task.update.mockResolvedValue(updated);
            const res = await service.updateStatus('tsk-1', 'DONE', 'usr-dev');
            expect(res.status).toBe('DONE');
            expect(prisma.task.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'tsk-1' } }));
        });
    });
});
//# sourceMappingURL=tasks.service.spec.js.map