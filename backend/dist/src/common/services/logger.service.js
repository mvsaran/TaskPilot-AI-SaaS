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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = require("winston");
let LoggerService = class LoggerService {
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                        const ctx = context ? `[${context}] ` : '';
                        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                        return `${timestamp} ${level}: ${ctx}${message} ${metaStr}`;
                    })),
                }),
            ],
        });
    }
    log(message, context, ...optionalParams) {
        this.logger.info(message, { context, ...optionalParams });
    }
    error(message, trace, context, ...optionalParams) {
        this.logger.error(message, { trace, context, ...optionalParams });
    }
    warn(message, context, ...optionalParams) {
        this.logger.warn(message, { context, ...optionalParams });
    }
    debug(message, context, ...optionalParams) {
        this.logger.debug(message, { context, ...optionalParams });
    }
    verbose(message, context, ...optionalParams) {
        this.logger.verbose(message, { context, ...optionalParams });
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map