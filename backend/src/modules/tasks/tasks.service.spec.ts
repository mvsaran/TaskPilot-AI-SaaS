import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;
  let audit: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
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
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
    audit = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tasks list', async () => {
      const mockTasks = [{ id: 'tsk-1', title: 'Task 1', status: 'TODO' }];
      (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);
      (prisma.task.count as jest.Mock).mockResolvedValue(1);

      const res = await service.findAll({ page: 1, limit: 10 });
      expect(res.data).toEqual(mockTasks);
      expect(res.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return task details when found', async () => {
      const mockTask = { id: 'tsk-1', title: 'Task 1', subtasks: [], comments: [] };
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const res = await service.findOne('tsk-1');
      expect(res).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update task status and log audit action', async () => {
      const existing = { id: 'tsk-1', title: 'Task 1', status: 'TODO' };
      const updated = { id: 'tsk-1', title: 'Task 1', status: 'DONE' };
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(existing);
      (prisma.task.update as jest.Mock).mockResolvedValue(updated);

      const res = await service.updateStatus('tsk-1', 'DONE' as any, 'usr-dev');
      expect(res.status).toBe('DONE');
      expect(prisma.task.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'tsk-1' } }));
    });
  });
});
