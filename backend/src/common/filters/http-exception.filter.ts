import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as any)?.message || 'Internal server error' };

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse.message || exceptionResponse.error || 'Error occurred'
        : exceptionResponse;

    this.logger.error(
      `HTTP Status: ${status} Error: ${JSON.stringify(message)} for path: ${request.url}`,
      (exception as any)?.stack || '',
      'HttpExceptionFilter',
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: typeof message === 'string' ? message : JSON.stringify(message),
      details: typeof exceptionResponse === 'object' ? exceptionResponse : null,
    });
  }
}
