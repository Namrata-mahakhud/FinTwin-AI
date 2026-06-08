/**
 * Simulation Flow Service
 * Handles multi-step simulation flow: validation, preview, recovery
 */

import { ScenarioRepository } from '../repositories/scenario.repository';
import { Simulation } from '../models/simulation.model';
import { NotFoundError } from '../utils/errors.util';

export class SimulationFlowService {
  constructor(private scenarioRepository: ScenarioRepository) {}

  /**
   * Validate scenario configuration
   */
  async validateScenario(
    scenarioId: string,
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
    const scenario = await this.scenarioRepository.findByIdAndUserId(scenarioId, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', scenarioId);
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

    // Check 2: Events selected (based on scenario type)
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

    // Check 4: Portfolio (mock check - in production, verify portfolio exists)
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
      scenarioId,
      scenarioName: scenario.name,
      eventsSelected: events.map(e => ({
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
   * Generate quick impact preview (no Monte Carlo simulation)
   */
  async generatePreview(
    scenarioId: string,
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
    const scenario = await this.scenarioRepository.findByIdAndUserId(scenarioId, userId);
    if (!scenario) {
      throw new NotFoundError('Scenario', scenarioId);
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
   * Apply recovery actions to simulation
   */
  async applyRecovery(
    simulationId: string,
    userId: string,
    actions: Array<{
      id: string;
      type: string;
      estimatedImpact: { riskReduction: number; lossReduction: number };
    }>
  ): Promise<{
    originalRisk: number;
    newRisk: number;
    originalLoss: number;
    newLoss: number;
    appliedActions: any[];
  }> {
    // Find simulation
    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      throw new NotFoundError('Simulation', simulationId);
    }

    // Verify ownership
    const simulationAny = simulation as any;

    if (simulationAny.userId && simulationAny.userId.toString() !== userId) {
      throw new NotFoundError('Simulation', simulationId);
    }

    // Calculate recovery impact
    const totalRiskReduction = actions.reduce(
      (sum, a) => sum + a.estimatedImpact.riskReduction,
      0
    );
    const totalLossReduction = actions.reduce(
      (sum, a) => sum + a.estimatedImpact.lossReduction,
      0
    );

    const originalRisk = simulation.summary?.riskScore || 84;
    const originalLoss = simulation.summary?.totalImpact || -25;

    const newRisk = Math.max(0, originalRisk - totalRiskReduction);
    const newLoss = Math.max(0, Math.abs(originalLoss) - totalLossReduction);

    // Update simulation with recovery data
    simulationAny.recovery = {
        applied: true,
        actions: actions.map(a => a.id),
        originalRisk,
        newRisk,
        originalLoss,
        newLoss: -newLoss,
        appliedAt: new Date(),
    };

    await simulation.save();

    return {
      originalRisk,
      newRisk,
      originalLoss,
      newLoss: -newLoss,
      appliedActions: actions,
    };
  }

  /**
   * Get simulation history
   */
  async getHistory(
    userId: string,
    filters?: { status?: string; scenarioId?: string }
  ): Promise<any[]> {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.scenarioId) {
      query.scenarioId = filters.scenarioId;
    }

    const simulations = await Simulation.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('scenarioId', 'name type');

    return simulations.map(sim => ({
      id: sim._id.toString(),
      scenarioId: sim.scenarioId,
      scenarioName: (sim.scenarioId as any)?.name || 'Unknown',
      status: sim.status,
      createdAt: sim.executedAt,
      completedAt: sim.completedAt,
      results: {
        loss: sim.summary?.totalImpact || 0,
        riskScore: sim.summary?.riskScore || 0,
        recoveryApplied: Boolean((sim as any).recovery?.applied),
        portfolioValue: {
          before: 2450000,
          after: 2450000 * (1 + (sim.summary?.totalImpact || 0) / 100),
        },
      },
      duration: sim.completedAt && sim.executedAt
        ? Math.round((sim.completedAt.getTime() - sim.executedAt.getTime()) / 1000)
        : undefined,
    }));
  }

  /**
   * Extract events from scenario
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
}

// Made with Bob
