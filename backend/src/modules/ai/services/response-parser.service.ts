import { Injectable, BadRequestException } from '@nestjs/common';
import { LoggerService } from '../../../common/services/logger.service';

@Injectable()
export class ResponseParserService {
  constructor(private readonly logger: LoggerService) {}

  parseAndValidate(rawOutput: any, expectedSchema?: any): any {
    if (!rawOutput) {
      throw new BadRequestException('Empty AI output received');
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
      } catch (err: any) {
        this.logger.warn(`Could not parse JSON string from AI output: ${rawOutput.substring(0, 100)}`, 'ResponseParserService');
        return { raw: rawOutput, text: rawOutput };
      }
    }

    return rawOutput;
  }

  private normalizeKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeKeys(item));
    }
    if (obj !== null && typeof obj === 'object') {
      const normalized: any = {};
      for (const [key, val] of Object.entries(obj)) {
        // Ensure standard camelCase keys
        const cleanKey = key.trim();
        normalized[cleanKey] = this.normalizeKeys(val);
      }
      return normalized;
    }
    return obj;
  }
}
