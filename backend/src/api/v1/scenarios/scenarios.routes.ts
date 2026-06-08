/**
 * Scenarios Routes
 */

import { FastifyInstance } from 'fastify';
import { ScenariosController } from './scenarios.controller';
import { EnhancedScenarioService } from '../../../services/enhanced-scenario.service';
import { ScenarioRepository } from '../../../repositories/scenario.repository';
import { Scenario } from '../../../models/scenario.model';
import { authenticate } from '../../../middleware/auth.middleware';
import {
  validateBody,
  validateParams,
  validateObjectId,
  validatePagination,
} from '../../../middleware/validation.middleware';
import {
  standardRateLimiter,
  simulationRateLimiter,
} from '../../../middleware/rate-limit.middleware';

export async function scenariosRoutes(fastify: FastifyInstance) {
  // Initialize dependencies
  const repository = new ScenarioRepository(Scenario);
  const service = new EnhancedScenarioService(repository);
  const controller = new ScenariosController(service);

  // Apply authentication to all routes
  fastify.addHook('onRequest', authenticate);

  // Create scenario
  fastify.post(
    '/',
    {
      preHandler: [standardRateLimiter],
    },
    controller.create
  );

  // Get all scenarios
  fastify.get(
    '/',
    {
      preHandler: [validatePagination, standardRateLimiter],
    },
    controller.findAll
  );

  // Get user's scenarios
  fastify.get(
    '/my-scenarios',
    {
      preHandler: [validatePagination, standardRateLimiter],
    },
    controller.getUserScenarios
  );

  // Get scenario by ID
  fastify.get(
    '/:id',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.findById
  );

  // Update scenario
  fastify.put(
    '/:id',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.update
  );

  // Delete scenario
  fastify.delete(
    '/:id',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.delete
  );

  // Simulate scenario
  fastify.post(
    '/:id/simulate',
    {
      preHandler: [validateObjectId('id'), simulationRateLimiter],
    },
    controller.simulate
  );

  // Activate scenario
  fastify.post(
    '/:id/activate',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.activate
  );

  // Complete scenario
  fastify.post(
    '/:id/complete',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.complete
  );

  // Archive scenario
  fastify.post(
    '/:id/archive',
    {
      preHandler: [validateObjectId('id'), standardRateLimiter],
    },
    controller.archive
  );
}

// Made with Bob
