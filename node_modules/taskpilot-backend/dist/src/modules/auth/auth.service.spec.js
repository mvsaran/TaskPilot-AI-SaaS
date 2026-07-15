"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const audit_service_1 = require("../../common/services/audit.service");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
describe('AuthService', () => {
    let service;
    let prisma;
    let jwt;
    let audit;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-jwt-token'),
                        verify: jest.fn(),
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
        service = module.get(auth_service_1.AuthService);
        prisma = module.get(prisma_service_1.PrismaService);
        jwt = module.get(jwt_1.JwtService);
        audit = module.get(audit_service_1.AuditService);
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
            prisma.user.findUnique.mockResolvedValue(mockUser);
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
            prisma.user.findUnique.mockResolvedValue(mockUser);
            await expect(service.login({ email: 'test@taskpilot.ai', password: 'wrongpassword' })).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('register', () => {
        it('should register new user and generate tokens', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue({
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
            prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
            await expect(service.register({ email: 'existing@taskpilot.ai', password: 'pass', fullName: 'Exist' })).rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map