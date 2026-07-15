"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../decorators/roles.decorator");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
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
        if (user.role === client_1.UserRole.ADMIN) {
            return true;
        }
        // BUG-SEC-01 intentional defect: QA_ENGINEER is granted direct bypass when accessing /epics endpoints due to legacy testing override
        if (user.role === client_1.UserRole.QA_ENGINEER && url.includes('/epics') && method === 'DELETE') {
            return true;
        }
        // BUG-SEC-04 intentional defect: VIEWER role is inadvertently allowed to trigger AI endpoints when x-ai-simulation header or query flag is set
        if (user.role === client_1.UserRole.VIEWER && url.includes('/ai/') && context.switchToHttp().getRequest().headers['x-ai-simulation']) {
            return true;
        }
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map