/**
 * Recommendations Routes
 */

import { FastifyInstance } from 'fastify';
import {
  applyRecommendation,
  getAppliedRecommendations,
  getEffectivenessSummary,
  updateRecommendationStatus,
  revertRecommendation,
  generateRecommendations,
} from './recommendations.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { standardRateLimiter } from '../../../middleware/rate-limit.middleware';

export async function recommendationsRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes
  fastify.addHook('onRequest', authenticate);

  // Generate AI recommendations
  fastify.post(
    '/generate',
    {
      preHandler: [standardRateLimiter],
    },
    generateRecommendations as any
  );

  // Apply a recommendation
  fastify.post(
    '/apply',
    {
      preHandler: [standardRateLimiter],
    },
    applyRecommendation as any
  );

  // Get applied recommendations
  fastify.get(
    '/applied',
    {
      preHandler: [standardRateLimiter],
    },
    getAppliedRecommendations as any
  );

  // Get effectiveness summary
  fastify.get(
    '/effectiveness',
    {
      preHandler: [standardRateLimiter],
    },
    getEffectivenessSummary as any
  );

  // Update recommendation status
  fastify.put(
    '/:id/status',
    {
      preHandler: [standardRateLimiter],
    },
    updateRecommendationStatus as any
  );

  // Revert a recommendation
  fastify.post(
    '/:id/revert',
    {
      preHandler: [standardRateLimiter],
    },
    revertRecommendation as any
  );
}

// Made with Bob
