/**
 * Scenarios Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { EnhancedScenarioService } from '../../../services/enhanced-scenario.service';
import {
  CreateScenarioDTO,
  UpdateScenarioDTO,
  SimulateScenarioDTO,
  ScenarioFilters,
} from '../../../types/scenario.types';
import { ResponseFormatter } from '../../../utils/helpers.util';
import { asyncHandler } from '../../../middleware/error.middleware';

export class ScenariosController {
  constructor(private service: EnhancedScenarioService) {}

  create = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as CreateScenarioDTO;
    const userId = (request as any).user.id;

    const scenario = await this.service.create(data, userId);
    return reply.status(201).send(ResponseFormatter.success(scenario));
  });

  findAll = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = (request as any).pagination;
    const filters = request.query as ScenarioFilters;
    const sort = (request.query as any).sort;

    const result = await this.service.findAll(filters, page, limit, sort);
    return reply.send(ResponseFormatter.paginated(result.items, page, limit, result.total));
  });

  findById = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const scenario = await this.service.findById(id);
    return reply.send(ResponseFormatter.success(scenario));
  });

  update = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = request.body as UpdateScenarioDTO;
    const userId = (request as any).user.id;

    const scenario = await this.service.update(id, data, userId);
    return reply.send(ResponseFormatter.success(scenario));
  });

  delete = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;

    await this.service.delete(id, userId);
    return reply.send(ResponseFormatter.success({ message: 'Scenario deleted successfully' }));
  });

  simulate = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = request.body as SimulateScenarioDTO;
    const userId = (request as any).user.id;

    const result = await this.service.simulate(id, data, userId);
    return reply.status(202).send(ResponseFormatter.success(result));
  });

  getUserScenarios = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = (request as any).pagination;
    const userId = (request as any).user.id;

    const result = await this.service.getUserScenarios(userId, page, limit);
    return reply.send(ResponseFormatter.paginated(result.items, page, limit, result.total));
  });

  activate = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;

    const scenario = await this.service.activateScenario(id, userId);
    return reply.send(ResponseFormatter.success(scenario));
  });

  complete = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;

    const scenario = await this.service.completeScenario(id, userId);
    return reply.send(ResponseFormatter.success(scenario));
  });

  archive = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;

    const scenario = await this.service.archiveScenario(id, userId);
    return reply.send(ResponseFormatter.success(scenario));
  });
}

// Made with Bob
