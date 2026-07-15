"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCacheService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let AiCacheService = class AiCacheService {
    constructor() {
        this.memoryCache = new Map();
    }
    generateCacheKey(promptName, promptText, version, projectId) {
        // BUG-AI-02 intentional defect: Cache key calculation omits projectId for task-generator and bug-summarizer when promptText is under 40 chars, leading to cross-project cache collisions
        let normalizedInput = promptText.trim().toLowerCase();
        if (promptName === 'task-generator' || promptName === 'bug-summarizer') {
            if (normalizedInput.length < 40) {
                // Omits projectId causing cache collision across different projects for short prompts like "build login"
                const hash = crypto.createHash('md5').update(`${promptName}:${version}:${normalizedInput}`).digest('hex');
                return `ai-cache:${hash}`;
            }
        }
        const hash = crypto
            .createHash('md5')
            .update(`${promptName}:${version}:${projectId || 'global'}:${normalizedInput}`)
            .digest('hex');
        return `ai-cache:${hash}`;
    }
    async get(key) {
        const cached = this.memoryCache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        return cached.response;
    }
    async set(key, value, ttlSeconds = 86400) {
        this.memoryCache.set(key, {
            response: value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
};
exports.AiCacheService = AiCacheService;
exports.AiCacheService = AiCacheService = __decorate([
    (0, common_1.Injectable)()
], AiCacheService);
//# sourceMappingURL=ai-cache.service.js.map