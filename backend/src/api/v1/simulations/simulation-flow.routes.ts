/**
 * Simulation Flow Routes
 * Multi-step simulation flow endpoints
 */

import { FastifyInstance } from 'fastify';
import { SimulationFlowController } from './simulation-flow.controller';
import { SimulationFlowService } from '../../../services/simulation-flow.service';
import { ScenarioRepository } from '../../../repositories/scenario.repository';
import { Scenario } from '../../../models/scenario.model';
import { authenticate } from '../../../middleware/auth.middleware';
import {
  validateObjectId,
  validatePagination,
} from '../../../middleware/validation.middleware';
import { standardRateLimiter } from '../../../middleware/rate-limit.middleware';

export async function simulationFlowRoutes(fastify: FastifyInstance) {
  // Initialize dependencies
  const scenarioRepository = new ScenarioRepository(Scenario);
  const service = new SimulationFlowService(scenarioRepository);
  const controller = new SimulationFlowController(service);

  // Apply authentication to all routes
  fastify.addHook('onRequest', authenticate);

  // Validate scenario
  fastify.post(
    '/scenarios/:id/validate',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.validateScenario
  );

  // Generate impact preview
  fastify.post(
    '/scenarios/:id/preview',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.generatePreview
  );

  // Apply recovery actions
  fastify.post(
    '/simulations/:id/apply-recovery',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.applyRecovery
  );

  // Get simulation history
  fastify.get(
    '/simulations/history',
    {
      preHandler: [standardRateLimiter],
    },
    controller.getHistory
  );

  // Replay simulation
  fastify.post(
    '/simulations/:id/replay',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.replaySimulation
  );

  // Compare simulations
  fastify.get(
    '/simulations/compare',
    {
      preHandler: [standardRateLimiter],
    },
    controller.compareSimulations
  );

  // Export simulation
  fastify.get(
    '/simulations/:id/export',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.exportSimulation
  );
}

// Made with Bob