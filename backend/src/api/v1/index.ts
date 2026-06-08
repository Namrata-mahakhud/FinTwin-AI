/**
 * API v1 Routes Index
 * Registers all API routes
 */

import { FastifyInstance } from 'fastify';
import { scenariosRoutes } from './scenarios/scenarios.routes';
import { marketRoutes } from './market/market.routes';
import { recommendationsRoutes } from './recommendations/recommendations.routes';
import { simulationFlowRoutes } from './simulations/simulation-flow.routes';
import authRoutes from './auth';

export default async function v1Routes(fastify: FastifyInstance) {
  // Register all v1 routes
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(scenariosRoutes, { prefix: '/scenarios' });
  await fastify.register(simulationFlowRoutes, { prefix: '/' }); // No prefix, routes include /scenarios and /simulations
  await fastify.register(marketRoutes, { prefix: '/market' });
  await fastify.register(recommendationsRoutes, { prefix: '/recommendations' });
  
  // TODO: Register remaining routes when implemented
  // await fastify.register(portfoliosRoutes, { prefix: '/portfolios' });
  // await fastify.register(riskRoutes, { prefix: '/risk' });
  // await fastify.register(reportsRoutes, { prefix: '/reports' });
}

// Made with Bob
