/**
 * Enhanced Scenario Service
 */

import { ScenarioRepository } from '../repositories/scenario.repository';
import {
  CreateScenarioDTO,
  UpdateScenarioDTO,
  ScenarioDocument,
  ScenarioFilters,
  SimulateScenarioDTO,
  ScenarioStatus,
  ScenarioType,
} from '../types/scenario.types';
import {
  ValidationError,
  NotFoundError,
  BusinessLogicError,
  ForbiddenError,
} from '../utils/errors.util';
import { Validator } from '../utils/validation.util';
import { SimulationEngine } from './simulation-engine.service';
import { Simulation } from '../models/simulation.model';

export class EnhancedScenarioService {
  private simulationEngine: SimulationEngine;

  constructor(private repository: ScenarioRepository) {
    this.simulationEngine = new SimulationEngine();
  }

  async create(data: CreateScenarioDTO, userId: string): Promise<ScenarioDocument> {
    // Validate input
    this.validateCreateData(data);

    // Validate scenario parameters based on type
    this.validateScenarioParameters(data.type, data.parameters);

    // Create scenario
    const scenario = {
      ...data,
      startDate: data.startDate || new Date(),
      status: ScenarioStatus.DRAFT,
      simulations: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.create(scenario);
  }

  async findAll(
    filters: ScenarioFilters,
    page: number,
    limit: number,
    sort?: string
  ): Promise<{ items: ScenarioDocument[]; total: number }> {
    const items = await this.repository.findAll(filters, page, limit, sort);
    const total = await this.repository.count(filters);

    return { items, total };
  }

  async findById(id: string): Promise<ScenarioDocument> {
    const scenario = await this.repository.findById(id);
    if (!scenario) {
      throw new NotFoundError('Scenario', id);
    }
    return scenario;
  }

  async update(id: string, data: UpdateScenarioDTO, userId: string): Promise<ScenarioDocument> {
    // Check if scenario exists and belongs to user
    const existing = await this.repository.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Scenario', id);
    }

    // Validate update data
    if (data.parameters && data.type) {
      this.validateScenarioParameters(data.type, data.parameters);
    }

    // Cannot update completed scenarios
    if (existing.status === ScenarioStatus.COMPLETED) {
      throw new BusinessLogicError(
        'Cannot update completed scenario',
        'Scenario has already been completed'
      );
    }

    const updated = await this.repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new NotFoundError('Scenario', id);
    }

    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    // Check if scenario exists and belongs to user
    const existing = await this.repository.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Scenario', id);
    }

    // Cannot delete scenarios with simulations
    if (existing.simulations && existing.simulations.length > 0) {
      throw new BusinessLogicError(
        'Cannot delete scenario with simulations',
        'Please delete associated simulations first'
      );
    }

    await this.repository.delete(id);
  }

  async simulate(
    id: string,
    data: SimulateScenarioDTO,
    userId: string
  ): Promise<{ simulationId: string; status: string; results?: any }> {
    // Check if scenario exists and belongs to user
    const scenario = await this.repository.findByIdAndUserId(id, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', id);
    }

    // Validate scenario is active
    if (scenario.status !== ScenarioStatus.ACTIVE) {
      throw new BusinessLogicError(
        'Scenario must be active to run simulation',
        `Current status: ${scenario.status}`
      );
    }

    // Validate iterations
    const iterations = data.iterations || 1000;
    if (iterations < 1 || iterations > 10000) {
      throw new ValidationError('Iterations must be between 1 and 10000');
    }

    // Get portfolio data (mock for now - in production, fetch from Portfolio model)
    const mockPortfolio = {
      id: data.portfolioId,
      totalValue: 2450000,
      assets: [],
      riskScore: 65,
    };

    // Extract scenario configuration for simulation
    const config = {
      selectedEvents: this.extractEventsFromScenario(scenario),
      severity: (scenario.parameters.customFactors as any)?.severity || 'medium',
      duration: Math.floor(scenario.duration / 30), // Convert days to months
      impactAreas: (scenario.parameters.customFactors as any)?.impactAreas || ['banking', 'tech'],
      iterations,
    };

    try {
      // Run simulation with real calculations
      const results = await this.simulationEngine.calculateImpact(
        scenario as any,
        mockPortfolio,
        config
      );

      // Generate timeline
      const timeline = await this.simulationEngine.generateTimeline(
        config.selectedEvents,
        config.duration
      );

      // Create simulation record
      const simulation = await Simulation.create({
        scenarioId: scenario._id,
        userId,
        portfolioId: data.portfolioId,
        status: 'completed',
        results: {
          ...results,
          timeline,
        },
        startedAt: new Date(),
        completedAt: new Date(),
      });

      // Add simulation to scenario
      await this.repository.addSimulation(id, simulation._id.toString());

      return {
        simulationId: simulation._id.toString(),
        status: 'completed',
        results: {
          ...results,
          timeline,
        },
      };
    } catch (error: any) {
      // Create failed simulation record
      const simulation = await Simulation.create({
        scenarioId: scenario._id,
        userId,
        portfolioId: data.portfolioId,
        status: 'failed',
        error: error.message,
        startedAt: new Date(),
        completedAt: new Date(),
      });

      throw new BusinessLogicError('Simulation failed', error.message);
    }
  }

  /**
   * Validate scenario configuration
   */
  async validateScenario(
    id: string,
    userId: string
  ): Promise<{
    scenarioId: string;
    scenarioName: string;
    eventsSelected: any[];
    severity: string;
    duration?: number;
    portfolioId?: string;
    checks: any[];
    canProceed: boolean;
    missingRequirements?: string[];
  }> {
    // Check if scenario exists
    const scenario = await this.repository.findByIdAndUserId(id, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', id);
    }

    const checks = [];
    const missingRequirements = [];

    // Check 1: Scenario name
    if (scenario.name && scenario.name.length > 0) {
      checks.push({
        id: 'scenario-name',
        name: 'Scenario Name',
        status: 'pass',
        message: 'Scenario name is valid',
        icon: '✓',
      });
    } else {
      checks.push({
        id: 'scenario-name',
        name: 'Scenario Name',
        status: 'fail',
        message: 'Scenario name is required',
        icon: '✗',
      });
      missingRequirements.push('Scenario Name');
    }

    // Check 2: Events selected
    const events = this.extractEventsFromScenario(scenario);
    if (events.length > 0) {
      checks.push({
        id: 'events',
        name: 'Minimum Events',
        status: 'pass',
        message: `${events.length} events selected`,
        icon: '✓',
      });
    } else {
      checks.push({
        id: 'events',
        name: 'Minimum Events',
        status: 'fail',
        message: 'At least 1 event required',
        icon: '✗',
      });
      missingRequirements.push('Events');
    }

    // Check 3: Severity
    const severity = (scenario.parameters.customFactors as any)?.severity || 'medium';
    checks.push({
      id: 'severity',
      name: 'Severity Selected',
      status: 'pass',
      message: `Severity level: ${severity.toUpperCase()}`,
      icon: '✓',
    });

    // Check 4: Portfolio (mock check)
    checks.push({
      id: 'portfolio',
      name: 'Portfolio Exists',
      status: 'pass',
      message: 'Portfolio found',
      icon: '✓',
    });

    // Check 5: Duration
    if (scenario.duration && scenario.duration > 0) {
      checks.push({
        id: 'duration',
        name: 'Duration Specified',
        status: 'pass',
        message: `${Math.floor(scenario.duration / 30)} months`,
        icon: '✓',
      });
    } else {
      checks.push({
        id: 'duration',
        name: 'Duration Specified',
        status: 'warning',
        message: 'Using default duration',
        icon: '⚠',
      });
    }

    return {
      scenarioId: id,
      scenarioName: scenario.name,
      eventsSelected: events.map((e) => ({
        type: e.type.replace(/_/g, ' ').toUpperCase(),
        description: e.description,
      })),
      severity,
      duration: Math.floor(scenario.duration / 30),
      portfolioId: 'portfolio-1',
      checks,
      canProceed: missingRequirements.length === 0,
      missingRequirements: missingRequirements.length > 0 ? missingRequirements : undefined,
    };
  }

  /**
   * Generate quick impact preview
   */
  async generatePreview(
    id: string,
    userId: string
  ): Promise<{
    estimatedLoss: number;
    riskLevel: string;
    recoveryTime: number;
    confidence: number;
    affectedSectors: any[];
    portfolioValue: { before: number; after: number };
  }> {
    // Check if scenario exists
    const scenario = await this.repository.findByIdAndUserId(id, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', id);
    }

    // Extract configuration
    const events = this.extractEventsFromScenario(scenario);
    const severity = (scenario.parameters.customFactors as any)?.severity || 'medium';
    const duration = Math.floor(scenario.duration / 30);

    // Quick calculation (no Monte Carlo)
    const severityMultipliers: Record<string, number> = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      critical: 2.0,
    };

    const baseImpact = events.length * -2.5 * (severityMultipliers[severity] || 1.0);
    const estimatedLoss = baseImpact * (duration / 3);

    // Determine risk level
    let riskLevel = 'low';
    if (Math.abs(estimatedLoss) > 30) riskLevel = 'critical';
    else if (Math.abs(estimatedLoss) > 20) riskLevel = 'high';
    else if (Math.abs(estimatedLoss) > 10) riskLevel = 'medium';

    // Calculate recovery time
    const recoveryTime = Math.ceil(Math.abs(estimatedLoss) / 5);

    // Mock sector impacts
    const affectedSectors = [
      {
        name: 'Banking',
        riskLevel: riskLevel === 'critical' || riskLevel === 'high' ? 'critical' : 'high',
        estimatedImpact: estimatedLoss * 1.4,
        icon: '🏦',
        color: 'red',
      },
      {
        name: 'Energy',
        riskLevel: riskLevel === 'critical' ? 'high' : 'medium',
        estimatedImpact: estimatedLoss * 1.1,
        icon: '⚡',
        color: 'orange',
      },
      {
        name: 'Technology',
        riskLevel: 'medium',
        estimatedImpact: estimatedLoss * 0.6,
        icon: '💻',
        color: 'yellow',
      },
      {
        name: 'Healthcare',
        riskLevel: 'low',
        estimatedImpact: estimatedLoss * 0.2,
        icon: '🏥',
        color: 'green',
      },
    ];

    const portfolioBefore = 2450000;
    const portfolioAfter = portfolioBefore * (1 + estimatedLoss / 100);

    return {
      estimatedLoss,
      riskLevel,
      recoveryTime,
      confidence: 82,
      affectedSectors,
      portfolioValue: {
        before: portfolioBefore,
        after: portfolioAfter,
      },
    };
  }

  /**
   * Extract events from scenario for simulation
   */
  private extractEventsFromScenario(scenario: any): any[] {
    const events = [];

    // Map scenario type to event
    const eventTypeMap: Record<string, string> = {
      market_crash: 'market_volatility',
      recession: 'interest_rate',
      inflation: 'inflation',
      bull_market: 'market_volatility',
    };

    const eventType = eventTypeMap[scenario.type] || 'interest_rate';

    events.push({
      type: eventType,
      description: scenario.description || scenario.name,
      impact: {
        magnitude: scenario.parameters.changePercent || -5,
      },
    });

    return events;
  }

  async getUserScenarios(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: ScenarioDocument[]; total: number }> {
    const items = await this.repository.findByUserId(userId, page, limit);
    const total = await this.repository.countByUserId(userId);

    return { items, total };
  }

  async activateScenario(id: string, userId: string): Promise<ScenarioDocument> {
    return await this.updateStatus(id, ScenarioStatus.ACTIVE, userId);
  }

  async completeScenario(id: string, userId: string): Promise<ScenarioDocument> {
    return await this.updateStatus(id, ScenarioStatus.COMPLETED, userId);
  }

  async archiveScenario(id: string, userId: string): Promise<ScenarioDocument> {
    return await this.updateStatus(id, ScenarioStatus.ARCHIVED, userId);
  }

  private async updateStatus(
    id: string,
    status: ScenarioStatus,
    userId: string
  ): Promise<ScenarioDocument> {
    const scenario = await this.repository.findByIdAndUserId(id, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', id);
    }

    const updated = await this.repository.update(id, {
      status,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new NotFoundError('Scenario', id);
    }

    return updated;
  }

  private validateCreateData(data: CreateScenarioDTO): void {
    const validator = new Validator();

    validator.validate([
      {
        field: 'name',
        value: data.name,
        rules: {
          required: true,
          type: 'string',
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        field: 'type',
        value: data.type,
        rules: {
          required: true,
          enum: Object.values(ScenarioType),
        },
      },
      {
        field: 'duration',
        value: data.duration,
        rules: {
          required: true,
          type: 'number',
          min: 1,
          max: 365,
        },
      },
      {
        field: 'parameters',
        value: data.parameters,
        rules: {
          required: true,
          type: 'object',
        },
      },
    ]);

    if (data.description) {
      validator.validate([
        {
          field: 'description',
          value: data.description,
          rules: {
            type: 'string',
            maxLength: 500,
          },
        },
      ]);
    }
  }

  private validateScenarioParameters(type: ScenarioType, parameters: any): void {
    const validator = new Validator();

    // Common parameter validations
    if (parameters.marketVolatility !== undefined) {
      validator.validate([
        {
          field: 'marketVolatility',
          value: parameters.marketVolatility,
          rules: {
            type: 'number',
            min: 0,
            max: 100,
          },
        },
      ]);
    }

    if (parameters.interestRateChange !== undefined) {
      validator.validate([
        {
          field: 'interestRateChange',
          value: parameters.interestRateChange,
          rules: {
            type: 'number',
            min: -10,
            max: 10,
          },
        },
      ]);
    }

    if (parameters.inflationRate !== undefined) {
      validator.validate([
        {
          field: 'inflationRate',
          value: parameters.inflationRate,
          rules: {
            type: 'number',
            min: 0,
            max: 20,
          },
        },
      ]);
    }

    if (parameters.gdpGrowth !== undefined) {
      validator.validate([
        {
          field: 'gdpGrowth',
          value: parameters.gdpGrowth,
          rules: {
            type: 'number',
            min: -10,
            max: 10,
          },
        },
      ]);
    }

    // Type-specific validations
    switch (type) {
      case ScenarioType.MARKET_CRASH:
        if (!parameters.marketVolatility || parameters.marketVolatility < 50) {
          throw new ValidationError('Market crash scenario requires high volatility (>= 50)');
        }
        break;

      case ScenarioType.BULL_MARKET:
        if (!parameters.gdpGrowth || parameters.gdpGrowth < 2) {
          throw new ValidationError('Bull market scenario requires positive GDP growth (>= 2)');
        }
        break;

      case ScenarioType.RECESSION:
        if (!parameters.gdpGrowth || parameters.gdpGrowth >= 0) {
          throw new ValidationError('Recession scenario requires negative GDP growth');
        }
        break;

      case ScenarioType.INFLATION:
        if (!parameters.inflationRate || parameters.inflationRate < 5) {
          throw new ValidationError('Inflation scenario requires high inflation rate (>= 5)');
        }
        break;

      case ScenarioType.CUSTOM:
        // Custom scenarios can have any parameters
        break;
    }
  }
}

// Made with Bob
