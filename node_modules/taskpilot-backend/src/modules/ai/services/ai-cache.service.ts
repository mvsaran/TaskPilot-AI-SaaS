import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AiCacheService {
  private memoryCache: Map<string, { response: any; expiresAt: number }> = new Map();

  generateCacheKey(promptName: string, promptText: string, version: string, projectId?: string): string {
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

  async get(key: string): Promise<any | null> {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return cached.response;
  }

  async set(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
    this.memoryCache.set(key, {
      response: value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
}
