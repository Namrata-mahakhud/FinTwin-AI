import { Scenario, IScenario, EventType, ScenarioStatus } from '../models/scenario.model';
import { ApiError, PaginatedResponse, PaginationQuery } from '../types';
import { logger } from '../config/logger';
import mongoose from 'mongoose';

export interface CreateScenarioDto {
  name: string;
  description: string;
  eventType: EventType;
  parameters: {
    changePercent?: number;
    duration?: string;
    affectedRegions?: string[];
    severity?: string;
    customParams?: Record<string, unknown>;
  };
  targetDate: Date;
}

export interface UpdateScenarioDto {
  name?: string;
  description?: string;
  parameters?: {
    changePercent?: number;
    duration?: string;
    affectedRegions?: string[];
    severity?: string;
    customParams?: Record<string, unknown>;
  };
  targetDate?: Date;
  status?: ScenarioStatus;
}

export class ScenarioService {
  /**
   * Create a new scenario
   */
  async createScenario(userId: string, data: CreateScenarioDto): Promise<IScenario> {
    try {
      // Validate event type
      if (!Object.values(EventType).includes(data.eventType)) {
        throw new ApiError(400, 'Invalid event type');
      }

      // Validate parameters based on event type
      this.validateScenarioParameters(data.eventType, data.parameters);

      const scenario = new Scenario({
        ...data,
        createdBy: new mongoose.Types.ObjectId(userId),
        status: ScenarioStatus.DRAFT,
      });

      await scenario.save();

      logger.info(`Scenario created: ${scenario.name} by user ${userId}`);

      return scenario;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Create scenario error:', error);
      throw new ApiError(500, 'Failed to create scenario');
    }
  }

  /**
   * Get scenarios with pagination
   */
  async getScenarios(
    userId: string,
    query: PaginationQuery & { status?: ScenarioStatus; eventType?: EventType }
  ): Promise<PaginatedResponse<IScenario>> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      // Build filter
      const filter: Record<string, unknown> = { createdBy: userId };
      if (query.status) filter.status = query.status;
      if (query.eventType) filter.eventType = query.eventType;

      // Build sort
      const sortField = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
      const sort = { [sortField]: sortOrder } as Record<string, 1 | -1>;

      // Execute query
      const [scenarios, total] = await Promise.all([
        Scenario.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        Scenario.countDocuments(filter),
      ]);

      return {
        data: scenarios,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get scenarios error:', error);
      throw new ApiError(500, 'Failed to get scenarios');
    }
  }

  /**
   * Get scenario by ID
   */
  async getScenarioById(scenarioId: string, userId: string): Promise<IScenario> {
    try {
      const scenario = await Scenario.findOne({
        _id: scenarioId,
        createdBy: userId,
      });

      if (!scenario) {
        throw new ApiError(404, 'Scenario not found');
      }

      return scenario;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Get scenario error:', error);
      throw new ApiError(500, 'Failed to get scenario');
    }
  }

  /**
   * Update scenario
   */
  async updateScenario(
    scenarioId: string,
    userId: string,
    data: UpdateScenarioDto
  ): Promise<IScenario> {
    try {
      const scenario = await Scenario.findOne({
        _id: scenarioId,
        createdBy: userId,
      });

      if (!scenario) {
        throw new ApiError(404, 'Scenario not found');
      }

      // Update fields
      if (data.name) scenario.name = data.name;
      if (data.description) scenario.description = data.description;
      if (data.targetDate) scenario.targetDate = data.targetDate;
      if (data.status) scenario.status = data.status;
      if (data.parameters) {
        scenario.parameters = { ...scenario.parameters, ...data.parameters };
        // Validate updated parameters
        this.validateScenarioParameters(scenario.eventType, scenario.parameters);
      }

      await scenario.save();

      logger.info(`Scenario updated: ${scenario.name}`);

      return scenario;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Update scenario error:', error);
      throw new ApiError(500, 'Failed to update scenario');
    }
  }

  /**
   * Delete scenario
   */
  async deleteScenario(scenarioId: string, userId: string): Promise<void> {
    try {
      const result = await Scenario.deleteOne({
        _id: scenarioId,
        createdBy: userId,
      });

      if (result.deletedCount === 0) {
        throw new ApiError(404, 'Scenario not found');
      }

      logger.info(`Scenario deleted: ${scenarioId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Delete scenario error:', error);
      throw new ApiError(500, 'Failed to delete scenario');
    }
  }

  /**
   * Clone scenario
   */
  async cloneScenario(scenarioId: string, userId: string): Promise<IScenario> {
    try {
      const originalScenario = await this.getScenarioById(scenarioId, userId);

      const clonedScenario = new Scenario({
        name: `${originalScenario.name} (Copy)`,
        description: originalScenario.description,
        eventType: originalScenario.eventType,
        parameters: originalScenario.parameters,
        targetDate: originalScenario.targetDate,
        createdBy: new mongoose.Types.ObjectId(userId),
        status: ScenarioStatus.DRAFT,
      });

      await clonedScenario.save();

      logger.info(`Scenario cloned: ${originalScenario.name} -> ${clonedScenario.name}`);

      return clonedScenario;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Clone scenario error:', error);
      throw new ApiError(500, 'Failed to clone scenario');
    }
  }

  /**
   * Validate scenario parameters based on event type
   */
  private validateScenarioParameters(
    eventType: EventType,
    parameters: Record<string, unknown>
  ): void {
    switch (eventType) {
      case EventType.INTEREST_RATE_CHANGE:
      case EventType.INFLATION_CHANGE:
        if (
          typeof parameters.changePercent !== 'number' ||
          parameters.changePercent < -100 ||
          parameters.changePercent > 100
        ) {
          throw new ApiError(400, 'changePercent must be between -100 and 100');
        }
        break;

      case EventType.SECTOR_CRASH:
        if (!parameters.severity || !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parameters.severity as string)) {
          throw new ApiError(400, 'severity must be LOW, MEDIUM, HIGH, or CRITICAL');
        }
        break;

      case EventType.CURRENCY_FLUCTUATION:
        if (!Array.isArray(parameters.affectedRegions) || parameters.affectedRegions.length === 0) {
          throw new ApiError(400, 'affectedRegions must be a non-empty array');
        }
        break;

      case EventType.OIL_PRICE_CHANGE:
        if (
          typeof parameters.changePercent !== 'number' ||
          parameters.changePercent < -100 ||
          parameters.changePercent > 500
        ) {
          throw new ApiError(400, 'changePercent must be between -100 and 500');
        }
        break;

      case EventType.GLOBAL_CRISIS:
        if (!parameters.severity) {
          throw new ApiError(400, 'severity is required for global crisis events');
        }
        break;
    }
  }

  /**
   * Get scenario statistics
   */
  async getScenarioStats(userId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byEventType: Record<string, number>;
  }> {
    try {
      const [total, byStatus, byEventType] = await Promise.all([
        Scenario.countDocuments({ createdBy: userId }),
        Scenario.aggregate([
          { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Scenario.aggregate([
          { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: '$eventType', count: { $sum: 1 } } },
        ]),
      ]);

      return {
        total,
        byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byEventType: byEventType.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      };
    } catch (error) {
      logger.error('Get scenario stats error:', error);
      throw new ApiError(500, 'Failed to get scenario statistics');
    }
  }
}

export const scenarioService = new ScenarioService();

// Made with Bob
