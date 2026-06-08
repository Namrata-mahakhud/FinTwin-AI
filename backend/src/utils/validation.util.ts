/**
 * Validation Utilities for FinTwin Application
 */

import { ValidationError, ErrorDetails } from './errors.util';

export interface ValidationRule<T = unknown> {
  field: string;
  value: T;
  rules: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: T[];
    custom?: (value: T) => boolean | string;
  };
}

export class Validator {
  private errors: ErrorDetails[] = [];

  /**
   * Validate a single field
   */
  validateField(rule: ValidationRule): boolean {
    const { field, value, rules } = rule;

    // Required check
    if (rules.required && (value === undefined || value === null || value === '')) {
      this.errors.push({
        field,
        message: `${field} is required`,
      });
      return false;
    }

    // If not required and value is empty, skip other validations
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return true;
    }

    // Type check
    if (rules.type) {
      if (!this.checkType(value, rules.type)) {
        this.errors.push({
          field,
          message: `${field} must be of type ${rules.type}`,
          value,
        });
        return false;
      }
    }

    // Min/Max for numbers
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        this.errors.push({
          field,
          message: `${field} must be at least ${rules.min}`,
          value,
        });
        return false;
      }
      if (rules.max !== undefined && value > rules.max) {
        this.errors.push({
          field,
          message: `${field} must be at most ${rules.max}`,
          value,
        });
        return false;
      }
    }

    // MinLength/MaxLength for strings and arrays
    if (rules.type === 'string' || rules.type === 'array') {
      const length = rules.type === 'string' ? value.length : value.length;
      if (rules.minLength !== undefined && length < rules.minLength) {
        this.errors.push({
          field,
          message: `${field} must have at least ${rules.minLength} characters`,
          value,
        });
        return false;
      }
      if (rules.maxLength !== undefined && length > rules.maxLength) {
        this.errors.push({
          field,
          message: `${field} must have at most ${rules.maxLength} characters`,
          value,
        });
        return false;
      }
    }

    // Pattern check for strings
    if (rules.pattern && rules.type === 'string') {
      if (!rules.pattern.test(value)) {
        this.errors.push({
          field,
          message: `${field} format is invalid`,
          value,
        });
        return false;
      }
    }

    // Enum check
    if (rules.enum && !rules.enum.includes(value)) {
      this.errors.push({
        field,
        message: `${field} must be one of: ${rules.enum.join(', ')}`,
        value,
      });
      return false;
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (result !== true) {
        this.errors.push({
          field,
          message: typeof result === 'string' ? result : `${field} validation failed`,
          value,
        });
        return false;
      }
    }

    return true;
  }

  /**
   * Validate multiple fields
   */
  validate(rules: ValidationRule[]): void {
    this.errors = [];
    rules.forEach((rule) => this.validateField(rule));

    if (this.errors.length > 0) {
      throw new ValidationError('Validation failed', this.errors);
    }
  }

  /**
   * Check type of value
   */
  private checkType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value));
      default:
        return false;
    }
  }

  /**
   * Get validation errors
   */
  getErrors(): ErrorDetails[] {
    return this.errors;
  }
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  mongoId: /^[0-9a-fA-F]{24}$/,
  symbol: /^[A-Z]{1,5}$/,
  currency: /^[A-Z]{3}$/,
  percentage: /^-?\d+(\.\d+)?$/,
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return ValidationPatterns.mongoId.test(id);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  return ValidationPatterns.email.test(email);
};

/**
 * Validate stock symbol
 */
export const isValidSymbol = (symbol: string): boolean => {
  return ValidationPatterns.symbol.test(symbol);
};

/**
 * Validate currency code
 */
export const isValidCurrency = (currency: string): boolean => {
  return ValidationPatterns.currency.test(currency);
};

/**
 * Validate date range
 */
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

/**
 * Validate percentage (0-100)
 */
export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (
  page?: number,
  limit?: number
): { page: number; limit: number } => {
  const validPage = Math.max(1, page || 1);
  const validLimit = Math.min(100, Math.max(1, limit || 10));
  return { page: validPage, limit: validLimit };
};

/**
 * Validate sort parameter
 */
export const validateSort = (
  sort?: string,
  allowedFields: string[] = []
): { field: string; order: 1 | -1 } | null => {
  if (!sort) return null;

  const order = sort.startsWith('-') ? -1 : 1;
  const field = sort.replace(/^-/, '');

  if (allowedFields.length > 0 && !allowedFields.includes(field)) {
    throw new ValidationError(`Invalid sort field: ${field}. Allowed fields: ${allowedFields.join(', ')}`);
  }

  return { field, order };
};

/**
 * Validate query filters
 */
export const validateFilters = (filters: Record<string, any>, allowedFields: string[] = []): Record<string, any> => {
  const validFilters: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (allowedFields.length > 0 && !allowedFields.includes(key)) {
      continue; // Skip invalid fields
    }
    validFilters[key] = value;
  }

  return validFilters;
};

/**
 * Create validation schema helper
 */
export const createValidationSchema = (schema: Record<string, ValidationRule['rules']>) => {
  return (data: Record<string, any>) => {
    const validator = new Validator();
    const rules: ValidationRule[] = Object.entries(schema).map(([field, rules]) => ({
      field,
      value: data[field],
      rules,
    }));
    validator.validate(rules);
  };
};

/**
 * Fastify schema to JSON schema converter helper
 */
export const toJSONSchema = (rules: ValidationRule['rules']): Record<string, unknown> => {
  const schema: Record<string, unknown> = {};

  if (rules.type) {
    schema.type = rules.type;
  }

  if (rules.min !== undefined) {
    schema.minimum = rules.min;
  }

  if (rules.max !== undefined) {
    schema.maximum = rules.max;
  }

  if (rules.minLength !== undefined) {
    schema.minLength = rules.minLength;
  }

  if (rules.maxLength !== undefined) {
    schema.maxLength = rules.maxLength;
  }

  if (rules.pattern) {
    schema.pattern = rules.pattern.source;
  }

  if (rules.enum) {
    schema.enum = rules.enum;
  }

  return schema;
};


