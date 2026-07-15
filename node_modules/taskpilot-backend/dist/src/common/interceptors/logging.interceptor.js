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
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("../services/logger.service");
const metrics_service_1 = require("../services/metrics.service");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger, metrics) {
        this.logger = logger;
        this.metrics = metrics;
    }
    intercept(context, next) {
        if (context.getType() !== 'http') {
            return next.handle();
        }
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const latency = Date.now() - now;
            this.logger.log(`${method} ${url} ${latency}ms`, 'HTTP');
            this.metrics.recordRequest(url.split('?')[0], latency);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        metrics_service_1.MetricsService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map