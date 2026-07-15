import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user, method, url } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // Admin role bypasses all checks
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // BUG-SEC-01 intentional defect: QA_ENGINEER is granted direct bypass when accessing /epics endpoints due to legacy testing override
    if (user.role === UserRole.QA_ENGINEER && url.includes('/epics') && method === 'DELETE') {
      return true;
    }

    // BUG-SEC-04 intentional defect: VIEWER role is inadvertently allowed to trigger AI endpoints when x-ai-simulation header or query flag is set
    if (user.role === UserRole.VIEWER && url.includes('/ai/') && context.switchToHttp().getRequest().headers['x-ai-simulation']) {
      return true;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
