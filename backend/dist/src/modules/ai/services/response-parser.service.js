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
exports.ResponseParserService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../../../common/services/logger.service");
let ResponseParserService = class ResponseParserService {
    constructor(logger) {
        this.logger = logger;
    }
    parseAndValidate(rawOutput, expectedSchema) {
        if (!rawOutput) {
            throw new common_1.BadRequestException('Empty AI output received');
        }
        if (typeof rawOutput === 'object') {
            return this.normalizeKeys(rawOutput);
        }
        if (typeof rawOutput === 'string') {
            try {
                // Try to parse if it contains JSON block inside markdown ```json ... ```
                const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/);
                const jsonStr = jsonMatch ? jsonMatch[1] : rawOutput;
                const parsed = JSON.parse(jsonStr);
                return this.normalizeKeys(parsed);
            }
            catch (err) {
                this.logger.warn(`Could not parse JSON string from AI output: ${rawOutput.substring(0, 100)}`, 'ResponseParserService');
                return { raw: rawOutput, text: rawOutput };
            }
        }
        return rawOutput;
    }
    normalizeKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.normalizeKeys(item));
        }
        if (obj !== null && typeof obj === 'object') {
            const normalized = {};
            for (const [key, val] of Object.entries(obj)) {
                // Ensure standard camelCase keys
                const cleanKey = key.trim();
                normalized[cleanKey] = this.normalizeKeys(val);
            }
            return normalized;
        }
        return obj;
    }
};
exports.ResponseParserService = ResponseParserService;
exports.ResponseParserService = ResponseParserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], ResponseParserService);
//# sourceMappingURL=response-parser.service.js.map