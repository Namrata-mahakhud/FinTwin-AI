/**
 * Market Routes
 */

import { FastifyInstance } from 'fastify';
import { MarketController } from './market.controller';
import { MarketService } from '../../../services/market.service';
import { authenticate } from '../../../middleware/auth.middleware';
import {
  standardRateLimiter,
  simulationRateLimiter,
} from '../../../middleware/rate-limit.middleware';

export async function marketRoutes(fastify: FastifyInstance) {
  // Initialize dependencies
  const service = new MarketService();
  const controller = new MarketController(service);

  // Apply authentication to all routes
  fastify.addHook('onRequest', authenticate);

  // Get market data
  fastify.get(
    '/data',
    {
      preHandler: [standardRateLimiter],
    },
    controller.getMarketData
  );

  // Get technical indicators
  fastify.get(
    '/indicators',
    {
      preHandler: [standardRateLimiter],
    },
    controller.getIndicators
  );

  // Simulate market conditions
  fastify.post(
    '/simulate',
    {
      preHandler: [simulationRateLimiter],
    },
    controller.simulateMarket
  );

  // Get volatility metrics
  fastify.get(
    '/volatility',
    {
      preHandler: [standardRateLimiter],
    },
    controller.getVolatility
  );
}

// Made with Bob
