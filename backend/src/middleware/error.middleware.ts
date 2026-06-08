/**
 * Error Handling Middleware for Fastify
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../config/logger';
import { config } from '../config/environment';
import { AppError, ErrorHandler, InternalError } from '../utils/errors.util';

/**
 * Global error handler
 */
export async function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Generate request ID if not exists
  const requestId = (request.id as string) || generateRequestId();

  // Handle AppError (our custom errors)
  if (error instanceof AppError) {
    ErrorHandler.logError(error, logger);

    const response = error.toJSON();
    if (requestId) {
      response.error.requestId = requestId;
    }

    return reply.status(error.statusCode).send(response);
  }

  // Handle Fastify validation errors
  if ((error as FastifyError).validation) {
    logger.warn({
      message: 'Validation error',
      validation: (error as FastifyError).validation,
      requestId,
    });

    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: (error as FastifyError).validation,
        requestId,
      },
    });
  }

  // Handle MongoDB duplicate key error
  if ('code' in error && (error as any).code === 11000) {
    logger.warn({
      message: 'Duplicate key error',
      requestId,
    });

    return reply.status(409).send({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A record with this value already exists',
        requestId,
      },
    });
  }

  // Handle MongoDB cast error
  if (error.name === 'CastError') {
    logger.warn({
      message: 'Invalid ID format',
      requestId,
    });

    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid ID format',
        requestId,
      },
    });
  }

  // Handle Fastify errors
  if ((error as FastifyError).statusCode) {
    logger.error({
      message: error.message,
      statusCode: (error as FastifyError).statusCode,
      requestId,
      stack: error.stack,
    });

    return reply.status((error as FastifyError).statusCode!).send({
      success: false,
      error: {
        code: 'REQUEST_ERROR',
        message: error.message,
        requestId,
        ...(config.app.isDevelopment && { stack: error.stack }),
      },
    });
  }

  // Handle unknown errors
  logger.error({
    message: 'Unexpected error',
    error: error.message,
    stack: error.stack,
    requestId,
  });

  const internalError = new InternalError();
  const response = internalError.toJSON();
  response.error.requestId = requestId;

  if (config.app.isDevelopment) {
    (response.error as any).stack = error.stack;
  }

  return reply.status(500).send(response);
}

/**
 * Not found handler
 */
export async function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  logger.warn({
    message: 'Route not found',
    method: request.method,
    url: request.url,
  });

  return reply.status(404).send({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${request.method} ${request.url} not found`,
    },
  });
}

/**
 * Request timeout handler
 */
export async function timeoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  logger.warn({
    message: 'Request timeout',
    method: request.method,
    url: request.url,
  });

  return reply.status(408).send({
    success: false,
    error: {
      code: 'REQUEST_TIMEOUT',
      message: 'Request timeout',
    },
  });
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (
  handler: (request: FastifyRequest, reply: FastifyReply) => Promise<any>
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await handler(request, reply);
    } catch (error) {
      await errorHandler(error as Error, request, reply);
    }
  };
};

// Made with Bob
