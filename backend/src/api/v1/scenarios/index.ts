import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { scenarioService, CreateScenarioDto, UpdateScenarioDto } from '../../../services/scenario.service';
import { authenticate } from '../../../middleware/auth.middleware';
import { EventType, ScenarioStatus } from '../../../models/scenario.model';

export default async function scenarioRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * @route POST /api/v1/scenarios
   * @desc Create a new scenario
   * @access Private
   */
  fastify.post<{ Body: CreateScenarioDto }>(
    '/',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Create a new economic scenario',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name', 'description', 'eventType', 'parameters', 'targetDate'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 100 },
            description: { type: 'string', minLength: 10, maxLength: 500 },
            eventType: {
              type: 'string',
              enum: Object.values(EventType),
            },
            parameters: {
              type: 'object',
              properties: {
                changePercent: { type: 'number' },
                duration: { type: 'string' },
                affectedRegions: { type: 'array', items: { type: 'string' } },
                severity: { type: 'string' },
                customParams: { type: 'object' },
              },
            },
            targetDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateScenarioDto }>, reply: FastifyReply) => {
      const scenario = await scenarioService.createScenario(request.user!.userId, request.body);
      return reply.code(201).send(scenario);
    }
  );

  /**
   * @route GET /api/v1/scenarios
   * @desc Get all scenarios for the authenticated user
   * @access Private
   */
  fastify.get<{
    Querystring: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: ScenarioStatus;
      eventType?: EventType;
    };
  }>(
    '/',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Get all scenarios with pagination and filters',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            sortBy: { type: 'string', default: 'createdAt' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            status: { type: 'string', enum: Object.values(ScenarioStatus) },
            eventType: { type: 'string', enum: Object.values(EventType) },
          },
        },
      },
    },
    async (request, reply: FastifyReply) => {
      const scenarios = await scenarioService.getScenarios(request.user!.userId, request.query);
      return reply.send(scenarios);
    }
  );

  /**
   * @route GET /api/v1/scenarios/stats
   * @desc Get scenario statistics
   * @access Private
   */
  fastify.get(
    '/stats',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Get scenario statistics for the authenticated user',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const stats = await scenarioService.getScenarioStats(request.user!.userId);
      return reply.send(stats);
    }
  );

  /**
   * @route GET /api/v1/scenarios/:id
   * @desc Get scenario by ID
   * @access Private
   */
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Get scenario by ID',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const scenario = await scenarioService.getScenarioById(
        request.params.id,
        request.user!.userId
      );
      return reply.send(scenario);
    }
  );

  /**
   * @route PUT /api/v1/scenarios/:id
   * @desc Update scenario
   * @access Private
   */
  fastify.put<{ Params: { id: string }; Body: UpdateScenarioDto }>(
    '/:id',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Update scenario',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 100 },
            description: { type: 'string', minLength: 10, maxLength: 500 },
            parameters: {
              type: 'object',
              properties: {
                changePercent: { type: 'number' },
                duration: { type: 'string' },
                affectedRegions: { type: 'array', items: { type: 'string' } },
                severity: { type: 'string' },
                customParams: { type: 'object' },
              },
            },
            targetDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: Object.values(ScenarioStatus) },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: UpdateScenarioDto }>,
      reply: FastifyReply
    ) => {
      const scenario = await scenarioService.updateScenario(
        request.params.id,
        request.user!.userId,
        request.body
      );
      return reply.send(scenario);
    }
  );

  /**
   * @route DELETE /api/v1/scenarios/:id
   * @desc Delete scenario
   * @access Private
   */
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Delete scenario',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      await scenarioService.deleteScenario(request.params.id, request.user!.userId);
      return reply.code(204).send();
    }
  );

  /**
   * @route POST /api/v1/scenarios/:id/clone
   * @desc Clone scenario
   * @access Private
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/clone',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Scenarios'],
        description: 'Clone an existing scenario',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const clonedScenario = await scenarioService.cloneScenario(
        request.params.id,
        request.user!.userId
      );
      return reply.code(201).send(clonedScenario);
    }
  );
}

// Made with Bob
