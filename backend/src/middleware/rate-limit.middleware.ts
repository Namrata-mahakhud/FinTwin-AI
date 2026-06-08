/**
 * Rate Limiting Middleware for Fastify
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitError } from '../utils/errors.util';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: FastifyRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * In-memory rate limit store
 */
class RateLimitMemoryStore {
  private store: RateLimitStore = {};

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const resetTime = now + windowMs;

    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime,
      };
    } else {
      this.store[key].count++;
    }

    return this.store[key];
  }

  decrement(key: string): void {
    if (this.store[key] && this.store[key].count > 0) {
      this.store[key].count--;
    }
  }

  reset(key: string): void {
    delete this.store[key];
  }

  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }
}

const store = new RateLimitMemoryStore();

// Cleanup expired entries every minute
setInterval(() => store.cleanup(), 60000);

/**
 * Create rate limiter middleware
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const key = keyGenerator(request);
    const { count, resetTime } = store.increment(key, windowMs);

    // Set rate limit headers
    reply.header('X-RateLimit-Limit', maxRequests);
    reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - count));
    reply.header('X-RateLimit-Reset', Math.floor(resetTime / 1000));

    if (count > maxRequests) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      reply.header('Retry-After', retryAfter);
      throw new RateLimitError(retryAfter);
    }

    // Fastify response hooks are registered on the instance, not the reply.
    // Keep the middleware request-scoped; skip options are reserved for a future plugin wrapper.
    void skipSuccessfulRequests;
    void skipFailedRequests;
  };
};

/**
 * Default key generator (uses IP address)
 */
function defaultKeyGenerator(request: FastifyRequest): string {
  return request.ip || 'unknown';
}

/**
 * Key generator using user ID
 */
export function userKeyGenerator(request: FastifyRequest): string {
  const user = (request as any).user;
  return user?.id || request.ip || 'unknown';
}

/**
 * Key generator using API key
 */
export function apiKeyGenerator(request: FastifyRequest): string {
  const apiKey = request.headers['x-api-key'] as string;
  return apiKey || request.ip || 'unknown';
}

/**
 * Predefined rate limiters
 */

// Standard rate limiter: 100 requests per minute
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

// Strict rate limiter: 10 requests per minute
export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
});

// Auth rate limiter: 5 requests per 15 minutes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

// Simulation rate limiter: 10 requests per minute
export const simulationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  keyGenerator: userKeyGenerator,
});

// Report generation rate limiter: 5 requests per minute
export const reportRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
  keyGenerator: userKeyGenerator,
});

// Made with Bob
