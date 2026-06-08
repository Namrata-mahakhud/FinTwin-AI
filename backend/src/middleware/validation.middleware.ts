/**
 * Validation Middleware for Fastify
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { Validator, ValidationRule } from '../utils/validation.util';
import { ValidationError } from '../utils/errors.util';

/**
 * Validate request body
 */
export const validateBody = (rules: Record<string, ValidationRule['rules']>) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validator = new Validator();
      const validationRules: ValidationRule[] = Object.entries(rules).map(
        ([field, fieldRules]) => ({
          field,
          value: (request.body as any)?.[field],
          rules: fieldRules,
        })
      );

      validator.validate(validationRules);
    } catch (error) {
      reply.status(400).send(error);
    }
  };
};

/**
 * Validate request query parameters
 */
export const validateQuery = (rules: Record<string, ValidationRule['rules']>) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validator = new Validator();
      const validationRules: ValidationRule[] = Object.entries(rules).map(
        ([field, fieldRules]) => ({
          field,
          value: (request.query as any)?.[field],
          rules: fieldRules,
        })
      );

      validator.validate(validationRules);
    } catch (error) {
      reply.status(400).send(error);
    }
  };
};

/**
 * Validate request params
 */
export const validateParams = (rules: Record<string, ValidationRule['rules']>) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validator = new Validator();
      const validationRules: ValidationRule[] = Object.entries(rules).map(
        ([field, fieldRules]) => ({
          field,
          value: (request.params as any)?.[field],
          rules: fieldRules,
        })
      );

      validator.validate(validationRules);
    } catch (error) {
      reply.status(400).send(error);
    }
  };
};

/**
 * Validate MongoDB ObjectId in params
 */
export const validateObjectId = (paramName: string = 'id') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as any)[paramName];

    if (!id) {
      throw new ValidationError(`Parameter '${paramName}' is required`);
    }

    const validator = new Validator();
    validator.validate([
      {
        field: paramName,
        value: id,
        rules: {
          required: true,
          type: 'string',
          pattern: /^[0-9a-fA-F]{24}$/,
        },
      },
    ]);
  };
};

/**
 * Validate pagination parameters
 */
export const validatePagination = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as any;
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;

  if (isNaN(page) || page < 1) {
    throw new ValidationError('Invalid page parameter');
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ValidationError('Invalid limit parameter (must be between 1 and 100)');
  }

  // Attach validated values to request
  (request as any).pagination = { page, limit };
};

/**
 * Sanitize request body
 */
export const sanitizeBody = async (request: FastifyRequest, reply: FastifyReply) => {
  if (request.body && typeof request.body === 'object') {
    request.body = sanitizeObject(request.body);
  }
};

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate file upload
 */
export const validateFileUpload = (options: {
  maxSize?: number;
  allowedTypes?: string[];
  required?: boolean;
}) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await (
      request as FastifyRequest & {
        file?: () => Promise<any>;
      }
    ).file?.();

    if (!data && options.required) {
      throw new ValidationError('File is required');
    }

    if (data) {
      // Check file size
      if (options.maxSize && data.file.bytesRead > options.maxSize) {
        throw new ValidationError(
          `File size exceeds maximum allowed size of ${options.maxSize} bytes`
        );
      }

      // Check file type
      if (options.allowedTypes && !options.allowedTypes.includes(data.mimetype)) {
        throw new ValidationError(
          `File type '${data.mimetype}' is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
        );
      }
    }
  };
};

// Made with Bob
