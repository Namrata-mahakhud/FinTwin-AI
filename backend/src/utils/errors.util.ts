/**
 * Custom Error Classes for FinTwin Application
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Business Logic
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  INVALID_OPERATION = 'INVALID_OPERATION',

  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  MARKET_DATA_UNAVAILABLE = 'MARKET_DATA_UNAVAILABLE',
  SIMULATION_FAILED = 'SIMULATION_FAILED',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Internal
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}

export interface ErrorDetails {
  field?: string;
  message: string;
  value?: any;
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: ErrorDetails[] | string;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: ErrorDetails[] | string,
    isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Error.captureStackTrace(this);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(this.requestId && { requestId: this.requestId }),
      },
    };
  }
}

/**
 * 400 Bad Request
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: ErrorDetails[]) {
    super(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, ErrorCode.UNAUTHORIZED);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, ErrorCode.FORBIDDEN);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, ErrorCode.NOT_FOUND);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 409, ErrorCode.CONFLICT, details);
  }
}

/**
 * 422 Unprocessable Entity
 */
export class BusinessLogicError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 422, ErrorCode.BUSINESS_LOGIC_ERROR, details);
  }
}

/**
 * 429 Too Many Requests
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super(
      'Too many requests. Please try again later.',
      429,
      ErrorCode.RATE_LIMIT_EXCEEDED
    );
    this.retryAfter = retryAfter;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        retryAfter: this.retryAfter,
      },
    };
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
  constructor(message = 'An unexpected error occurred', details?: string) {
    super(message, 500, ErrorCode.INTERNAL_ERROR, details, false);
  }
}

/**
 * 503 Service Unavailable
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, details?: string) {
    super(
      `External service '${service}' is unavailable`,
      503,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      details
    );
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 500, ErrorCode.DATABASE_ERROR, details, false);
  }
}

/**
 * Error Handler Utility
 */
export class ErrorHandler {
  /**
   * Check if error is operational (expected)
   */
  static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  /**
   * Log error with appropriate level
   */
  static logError(error: Error, logger: any): void {
    if (error instanceof AppError) {
      if (error.isOperational) {
        logger.warn({
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
          stack: error.stack,
        });
      } else {
        logger.error({
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
          stack: error.stack,
        });
      }
    } else {
      logger.error({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  /**
   * Handle error and determine if process should exit
   */
  static handleError(error: Error, logger: any): void {
    this.logError(error, logger);

    if (!this.isOperationalError(error)) {
      logger.error('Non-operational error detected. Consider process restart.');
      // In production, you might want to:
      // - Send alerts
      // - Gracefully shutdown
      // - Restart process
    }
  }
}

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, reply: any) => {
    Promise.resolve(fn(req, reply)).catch((error) => {
      reply.send(error);
    });
  };
};

// Made with Bob
