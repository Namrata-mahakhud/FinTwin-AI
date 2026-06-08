/**
 * Helper Utilities for FinTwin Application
 */

import { Types } from 'mongoose';

/**
 * Response formatter
 */
export class ResponseFormatter {
  /**
   * Success response
   */
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      ...(message && { message }),
      data,
    };
  }

  /**
   * Paginated response
   */
  static paginated<T>(data: T[], page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * List response with metadata
   */
  static list<T>(items: T[], metadata?: Record<string, unknown>) {
    return {
      success: true,
      data: {
        items,
        count: items.length,
        ...metadata,
      },
    };
  }
}

/**
 * Date utilities
 */
export class DateUtils {
  /**
   * Get date range for period
   */
  static getDateRange(period: string): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '1w':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case '5y':
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      case 'ytd':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'all':
        startDate.setFullYear(2000, 0, 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    return { startDate, endDate };
  }

  /**
   * Format date to ISO string
   */
  static toISOString(date: Date | string): string {
    return new Date(date).toISOString();
  }

  /**
   * Check if date is valid
   */
  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Get business days between dates
   */
  static getBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Add business days to date
   */
  static addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let addedDays = 0;

    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }

    return result;
  }
}

/**
 * Number utilities
 */
export class NumberUtils {
  /**
   * Round to decimal places
   */
  static round(value: number, decimals: number = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Format as currency
   */
  static formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  }

  /**
   * Format as percentage
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${this.round(value, decimals)}%`;
  }

  /**
   * Calculate percentage change
   */
  static percentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * Calculate compound annual growth rate (CAGR)
   */
  static calculateCAGR(beginningValue: number, endingValue: number, years: number): number {
    return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  }

  /**
   * Generate random number in range
   */
  static randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

/**
 * Array utilities
 */
export class ArrayUtils {
  /**
   * Chunk array into smaller arrays
   */
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Remove duplicates
   */
  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Group by key
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

  /**
   * Sort by key
   */
  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Calculate sum
   */
  static sum(array: number[]): number {
    return array.reduce((sum, val) => sum + val, 0);
  }

  /**
   * Calculate average
   */
  static average(array: number[]): number {
    return array.length > 0 ? this.sum(array) / array.length : 0;
  }

  /**
   * Calculate median
   */
  static median(array: number[]): number {
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calculate standard deviation
   */
  static standardDeviation(array: number[]): number {
    const avg = this.average(array);
    const squareDiffs = array.map((value) => Math.pow(value - avg, 2));
    const avgSquareDiff = this.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }
}

/**
 * Object utilities
 */
export class ObjectUtils {
  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Merge objects deeply
   */
  static deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (source) {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          Object.assign(
            source[key],
            this.deepMerge(
              (target as any)[key],
              (source as any)[key]
            )
          );
        }
      }
      Object.assign(target, source);
    }

    return this.deepMerge(target, ...sources);
  }
}

/**
 * String utilities
 */
export class StringUtils {
  /**
   * Convert to camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (c) => c.toLowerCase());
  }

  /**
   * Convert to snake_case
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Convert to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Truncate string
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Generate random string
   */
  static randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * MongoDB utilities
 */
export class MongoUtils {
  /**
   * Convert string to ObjectId
   */
  static toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  /**
   * Check if valid ObjectId
   */
  static isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  /**
   * Build query from filters
   */
  static buildQuery(filters: Record<string, any>): Record<string, any> {
    const query: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value;
      }
    }

    return query;
  }

  /**
   * Build sort object
   */
  static buildSort(sort?: string): Record<string, 1 | -1> {
    if (!sort) return { createdAt: -1 };

    const order = sort.startsWith('-') ? -1 : 1;
    const field = sort.replace(/^-/, '');

    return { [field]: order };
  }
}

/**
 * Async utilities
 */
export class AsyncUtils {
  /**
   * Sleep for milliseconds
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.sleep(delay * Math.pow(2, i));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Execute functions in parallel with limit
   */
  static async parallelLimit<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const promise = task().then((result) => {
        results.push(result);
      });

      executing.push(promise);

      if (executing.length >= limit) {
        await Promise.race(executing);
        const index = executing.findIndex((p) => p === promise);
        if (index !== -1) {
          executing.splice(index, 1);
        }
      }
    }

    await Promise.all(executing);
    return results;
  }
}

/**
 * Cache utilities
 */
export class CacheUtils {
  private static cache = new Map<string, { value: any; expiry: number }>();

  /**
   * Set cache value
   */
  static set(key: string, value: any, ttl: number = 3600000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get cache value
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Delete cache value
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get or set cache value
   */
  static async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 3600000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await fn();
    this.set(key, value, ttl);
    return value;
  }
}

// Made with Bob
