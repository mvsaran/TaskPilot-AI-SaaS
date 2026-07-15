import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuditService } from '../../common/services/audit.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly audit;
    constructor(prisma: PrismaService, jwtService: JwtService, audit: AuditService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    refreshToken(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            avatarUrl: any;
        };
    }>;
    private generateTokens;
}
