import { BaseAgent, AgentContext } from './base-agent';
import { Scenario, EventType } from '../models/scenario.model';
import { logger } from '../config/logger';

export class MarketAgent extends BaseAgent {
  constructor() {
    super('MARKET_AGENT');
  }

  protected async process(context: AgentContext): Promise<Record<string, unknown>> {
    this.validateContext(context);

    // Fetch scenario details
    const scenario = await Scenario.findById(context.scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    logger.info(`Market Agent analyzing scenario: ${scenario.eventType}`);

    // Analyze market impact based on event type
    const sectorImpacts = this.analyzeSectorImpacts(scenario.eventType, scenario.parameters);
    const marketVolatility = this.calculateMarketVolatility(
      scenario.eventType,
      scenario.parameters
    );
    const priceMovements = this.predictPriceMovements(sectorImpacts);

    return {
      sectorImpacts,
      marketVolatility,
      priceMovements,
      analysisTimestamp: new Date().toISOString(),
    };
  }

  protected calculateConfidence(result: Record<string, unknown>): number {
    // Base confidence on data completeness and volatility
    const hasAllData = result.sectorImpacts && result.marketVolatility && result.priceMovements;
    const volatility = (result.marketVolatility as number) || 0;

    // Lower confidence for high volatility scenarios
    const volatilityFactor = Math.max(0, 1 - volatility / 100);

    return hasAllData ? 0.7 + volatilityFactor * 0.3 : 0.5;
  }

  /**
   * Analyze sector impacts based on event type
   */
  private analyzeSectorImpacts(
    eventType: EventType,
    parameters: Record<string, unknown>
  ): Record<string, number> {
    const impacts: Record<string, number> = {};

    switch (eventType) {
      case EventType.INTEREST_RATE_CHANGE:
        const rateChange = (parameters.changePercent as number) || 0;
        impacts.BANKING = rateChange * 2.5; // Banks benefit from rate increases
        impacts.REAL_ESTATE = -rateChange * 1.8; // Real estate suffers
        impacts.TECHNOLOGY = -rateChange * 0.8;
        impacts.UTILITIES = -rateChange * 0.5;
        impacts.CONSUMER = -rateChange * 1.2;
        break;

      case EventType.INFLATION_CHANGE:
        const inflationChange = (parameters.changePercent as number) || 0;
        impacts.COMMODITIES = inflationChange * 1.5;
        impacts.REAL_ESTATE = inflationChange * 1.2;
        impacts.TECHNOLOGY = -inflationChange * 0.9;
        impacts.CONSUMER = -inflationChange * 1.5;
        impacts.BANKING = inflationChange * 0.8;
        break;

      case EventType.SECTOR_CRASH:
        const severity = parameters.severity as string;
        const crashImpact = this.getSeverityMultiplier(severity);
        impacts.TECHNOLOGY = -crashImpact * 25;
        impacts.BANKING = -crashImpact * 15;
        impacts.REAL_ESTATE = -crashImpact * 20;
        impacts.CONSUMER = -crashImpact * 10;
        impacts.UTILITIES = -crashImpact * 5;
        break;

      case EventType.OIL_PRICE_CHANGE:
        const oilChange = (parameters.changePercent as number) || 0;
        impacts.ENERGY = oilChange * 1.8;
        impacts.TRANSPORTATION = -oilChange * 1.2;
        impacts.MANUFACTURING = -oilChange * 0.8;
        impacts.CONSUMER = -oilChange * 0.6;
        impacts.TECHNOLOGY = -oilChange * 0.3;
        break;

      case EventType.CURRENCY_FLUCTUATION:
        impacts.EXPORT = -5;
        impacts.IMPORT = 5;
        impacts.TECHNOLOGY = -3;
        impacts.MANUFACTURING = -4;
        impacts.BANKING = 2;
        break;

      case EventType.GLOBAL_CRISIS:
        const crisisSeverity = this.getSeverityMultiplier(parameters.severity as string);
        impacts.BANKING = -crisisSeverity * 30;
        impacts.TECHNOLOGY = -crisisSeverity * 20;
        impacts.REAL_ESTATE = -crisisSeverity * 25;
        impacts.CONSUMER = -crisisSeverity * 35;
        impacts.UTILITIES = -crisisSeverity * 10;
        impacts.HEALTHCARE = crisisSeverity * 5; // Healthcare may benefit
        break;

      default:
        // Default minimal impact
        impacts.GENERAL = -2;
    }

    return impacts;
  }

  /**
   * Calculate overall market volatility
   */
  private calculateMarketVolatility(
    eventType: EventType,
    parameters: Record<string, unknown>
  ): number {
    let baseVolatility = 10; // Base 10% volatility

    switch (eventType) {
      case EventType.INTEREST_RATE_CHANGE:
        baseVolatility += Math.abs((parameters.changePercent as number) || 0) * 2;
        break;
      case EventType.SECTOR_CRASH:
        baseVolatility += this.getSeverityMultiplier(parameters.severity as string) * 15;
        break;
      case EventType.GLOBAL_CRISIS:
        baseVolatility += this.getSeverityMultiplier(parameters.severity as string) * 20;
        break;
      case EventType.OIL_PRICE_CHANGE:
        baseVolatility += Math.abs((parameters.changePercent as number) || 0) * 0.5;
        break;
      default:
        baseVolatility += 5;
    }

    return Math.min(baseVolatility, 100); // Cap at 100%
  }

  /**
   * Predict price movements
   */
  private predictPriceMovements(sectorImpacts: Record<string, number>): Record<
    string,
    {
      direction: 'UP' | 'DOWN' | 'NEUTRAL';
      magnitude: number;
    }
  > {
    const movements: Record<string, { direction: 'UP' | 'DOWN' | 'NEUTRAL'; magnitude: number }> =
      {};

    for (const [sector, impact] of Object.entries(sectorImpacts)) {
      movements[sector] = {
        direction: impact > 1 ? 'UP' : impact < -1 ? 'DOWN' : 'NEUTRAL',
        magnitude: Math.abs(impact),
      };
    }

    return movements;
  }

  /**
   * Get severity multiplier
   */
  private getSeverityMultiplier(severity: string): number {
    switch (severity?.toUpperCase()) {
      case 'LOW':
        return 0.5;
      case 'MEDIUM':
        return 1.0;
      case 'HIGH':
        return 1.5;
      case 'CRITICAL':
        return 2.0;
      default:
        return 1.0;
    }
  }
}

// Made with Bob
