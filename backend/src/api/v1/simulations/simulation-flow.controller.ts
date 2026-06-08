/**
 * Simulation Flow Controller
 * Handles multi-step simulation flow endpoints
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { SimulationFlowService } from '../../../services/simulation-flow.service';
import { ResponseFormatter } from '../../../utils/helpers.util';
import { asyncHandler } from '../../../middleware/error.middleware';

export class SimulationFlowController {
  constructor(private service: SimulationFlowService) {}

  /**
   * Validate scenario configuration
   * POST /api/v1/scenarios/:id/validate
   */
  validateScenario = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = (request as any).user.id;

      const result = await this.service.validateScenario(id, userId);
      return reply.send(ResponseFormatter.success(result));
    }
  );

  /**
   * Generate impact preview
   * POST /api/v1/scenarios/:id/preview
   */
  generatePreview = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = (request as any).user.id;

      const result = await this.service.generatePreview(id, userId);
      return reply.send(ResponseFormatter.success(result));
    }
  );

  /**
   * Apply recovery actions
   * POST /api/v1/simulations/:id/apply-recovery
   */
  applyRecovery = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = (request as any).user.id;
      const { actions } = request.body as { actions: any[] };

      const result = await this.service.applyRecovery(id, userId, actions);
      return reply.send(ResponseFormatter.success(result));
    }
  );

  /**
   * Get simulation history
   * GET /api/v1/simulations/history
   */
  getHistory = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const { status, scenarioId } = request.query as {
        status?: string;
        scenarioId?: string;
      };

      const result = await this.service.getHistory(userId, {
        status,
        scenarioId,
      });
      return reply.send(ResponseFormatter.success(result));
    }
  );

  /**
   * Replay simulation
   * POST /api/v1/simulations/:id/replay
   */
  replaySimulation = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = (request as any).user.id;

      // For now, just return the simulation ID to redirect to scenario
      return reply.send(
        ResponseFormatter.success({
          message: 'Replay initiated',
          simulationId: id,
          redirectTo: `/scenarios/${id}/run`,
        })
      );
    }
  );

  /**
   * Compare simulations
   * GET /api/v1/simulations/compare
   */
  compareSimulations = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { ids } = request.query as { ids: string };
      const userId = (request as any).user.id;

      const simulationIds = ids.split(',');

      // Mock comparison data
      const comparison = {
        simulations: simulationIds,
        metrics: {
          averageLoss: -20,
          averageRisk: 72,
          bestCase: -12,
          worstCase: -28,
        },
      };

      return reply.send(ResponseFormatter.success(comparison));
    }
  );

  /**
   * Export simulation
   * GET /api/v1/simulations/:id/export
   */
  exportSimulation = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = (request as any).user.id;

      // Mock export data
      const exportData = {
        simulationId: id,
        exportedAt: new Date().toISOString(),
        format: 'json',
        data: {
          scenario: 'Banking Crisis Q1',
          results: {
            loss: -25,
            risk: 84,
          },
        },
      };

      return reply.send(ResponseFormatter.success(exportData));
    }
  );
}

// Made with Bob