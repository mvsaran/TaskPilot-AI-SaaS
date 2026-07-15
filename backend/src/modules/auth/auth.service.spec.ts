import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from '../../common/services/audit.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let audit: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn(),
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

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    audit = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials and return tokens', async () => {
      const mockUser = {
        id: 'usr-1',
        email: 'test@taskpilot.ai',
        passwordHash: await bcrypt.hash('validpass', 10),
        fullName: 'Test User',
        role: 'DEVELOPER',
        isActive: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.login({ email: 'test@taskpilot.ai', password: 'validpass' });
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('mock-jwt-token');
      expect(audit.logAction).toHaveBeenCalledWith(expect.objectContaining({ action: 'LOGIN', userId: 'usr-1' }));
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const mockUser = {
        id: 'usr-1',
        email: 'test@taskpilot.ai',
        passwordHash: await bcrypt.hash('correctpass', 10),
        isActive: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.login({ email: 'test@taskpilot.ai', password: 'wrongpassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register new user and generate tokens', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'usr-new',
        email: 'new@taskpilot.ai',
        fullName: 'New Dev',
        role: 'DEVELOPER',
        avatarUrl: 'https://avatar.url',
      });

      const result = await service.register({
        email: 'new@taskpilot.ai',
        password: 'Password123!',
        fullName: 'New Dev',
      });

      expect(result.accessToken).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({ email: 'existing@taskpilot.ai', password: 'pass', fullName: 'Exist' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
