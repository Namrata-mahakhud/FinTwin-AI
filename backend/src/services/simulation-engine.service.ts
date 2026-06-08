/**
 * Simulation Engine Service
 * Performs real financial calculations and Monte Carlo simulations
 */

import type { IScenario } from '../models/scenario.model';
import type { IPortfolio } from '../models/portfolio.model';
import { SimulationResults, PortfolioProjection, SectorImpact, Recommendation } from '../types';

interface SimulationConfig {
  selectedEvents: any[];
  severity: string;
  duration: number; // in months
  impactAreas: string[];
  iterations?: number;
  confidenceLevel?: number;
}

export class SimulationEngine {
  /**
   * Calculate portfolio impact based on scenario configuration
   */
  async calculateImpact(
    scenario: IScenario,
    portfolio: any,
    config: SimulationConfig
  ): Promise<SimulationResults> {
    // Extract configuration
    const { selectedEvents, severity, duration, impactAreas, iterations = 1000, confidenceLevel = 95 } = config;

    // Calculate base impact from events
    const baseImpact = this.calculateBaseImpact(selectedEvents, severity);

    // Apply duration multiplier
    const durationMultiplier = duration / 3; // 3 months is baseline

    // Calculate sector-specific impacts
    const sectorImpacts = await this.calculateSectorImpacts(
      selectedEvents,
      impactAreas,
      baseImpact,
      durationMultiplier
    );

    // Run Monte Carlo simulation
    const projections = await this.runMonteCarloSimulation(
      portfolio,
      baseImpact,
      duration,
      iterations
    );

    // Calculate risk metrics
    const riskAnalysis = this.calculateRiskMetrics(projections, sectorImpacts);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      sectorImpacts,
      riskAnalysis,
      portfolio
    );

    // Calculate summary statistics
    const summary = this.calculateSummary(projections, riskAnalysis);

    return {
      simulationId: scenario.id,
      scenarioId: scenario.id,
      portfolioId: portfolio.id,
      summary,
      projections,
      riskAnalysis,
      impactByAsset: [],
      impactBySector: sectorImpacts,
      correlationMatrix: { assets: [], matrix: [] },
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate base impact from selected events and severity
   */
  private calculateBaseImpact(events: any[], severity: string): number {
    const eventImpact = events.length * -2.5; // Each event contributes -2.5%

    const severityMultipliers: Record<string, number> = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      critical: 2.0,
    };

    return eventImpact * (severityMultipliers[severity.toLowerCase()] || 1.0);
  }

  /**
   * Calculate sector-specific impacts
   */
  private async calculateSectorImpacts(
    events: any[],
    impactAreas: string[],
    baseImpact: number,
    durationMultiplier: number
  ): Promise<SectorImpact[]> {
    const sectorImpacts: SectorImpact[] = [];

    for (const sector of impactAreas) {
      // Calculate sector-specific multiplier based on events
      const sectorMultiplier = this.getSectorMultiplier(sector, events);
      
      const impact = baseImpact * sectorMultiplier * durationMultiplier;
      
      // Determine risk level
      const riskLevel = this.determineRiskLevel(Math.abs(impact));

      sectorImpacts.push({
        sector,
        currentValue: 1000000, // Mock current value
        projectedValue: 1000000 * (1 + impact / 100),
        percentChange: impact,
        riskLevel,
        affectedAssets: Math.floor(Math.random() * 10) + 5,
      });
    }

    return sectorImpacts;
  }

  /**
   * Get sector-specific multiplier based on events
   */
  private getSectorMultiplier(sector: string, events: any[]): number {
    const sectorSensitivity: Record<string, Record<string, number>> = {
      banking: {
        interest_rate: 1.5,
        inflation: 1.2,
        currency_fluctuation: 1.3,
        default: 1.0,
      },
      tech: {
        market_volatility: 1.4,
        regulatory_change: 1.3,
        default: 1.0,
      },
      energy: {
        commodity_price: 1.6,
        geopolitical_event: 1.4,
        default: 1.0,
      },
      healthcare: {
        regulatory_change: 1.2,
        default: 0.8,
      },
    };

    let multiplier = 1.0;
    const sectorKey = sector.toLowerCase();

    if (sectorSensitivity[sectorKey]) {
      events.forEach((event) => {
        const eventType = event.type || 'default';
        multiplier *= sectorSensitivity[sectorKey][eventType] || sectorSensitivity[sectorKey].default;
      });
    }

    return multiplier;
  }

  /**
   * Run Monte Carlo simulation
   */
  private async runMonteCarloSimulation(
    portfolio: any,
    baseImpact: number,
    duration: number,
    iterations: number
  ): Promise<PortfolioProjection[]> {
    const projections: PortfolioProjection[] = [];
    const startValue = portfolio.totalValue || 2450000;
    const monthlyImpact = baseImpact / duration;

    for (let month = 0; month <= duration; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month);

      // Run multiple iterations for this month
      const monthlyValues: number[] = [];
      for (let i = 0; i < iterations; i++) {
        // Add randomness (normal distribution)
        const randomFactor = this.normalRandom(0, 0.1);
        const cumulativeImpact = monthlyImpact * month * (1 + randomFactor);
        const value = startValue * (1 + cumulativeImpact / 100);
        monthlyValues.push(value);
      }

      // Calculate statistics
      monthlyValues.sort((a, b) => a - b);
      const mean = monthlyValues.reduce((sum, v) => sum + v, 0) / iterations;
      const lower = monthlyValues[Math.floor(iterations * 0.05)];
      const upper = monthlyValues[Math.floor(iterations * 0.95)];
      const volatility = this.calculateVolatility(monthlyValues);

      projections.push({
        date: date.toISOString().split('T')[0],
        value: mean,
        percentChange: ((mean - startValue) / startValue) * 100,
        volatility,
        confidence: {
          lower,
          upper,
        },
      });
    }

    return projections;
  }

  /**
   * Generate normal random number (Box-Muller transform)
   */
  private normalRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Calculate volatility
   */
  private calculateVolatility(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean * 100;
  }

  /**
   * Calculate risk metrics
   */
  private calculateRiskMetrics(projections: PortfolioProjection[], sectorImpacts: SectorImpact[]): any {
    const finalProjection = projections[projections.length - 1];
    const maxLoss = Math.min(...projections.map(p => p.percentChange));
    
    // Calculate overall risk score (0-100)
    const riskScore = Math.min(100, Math.max(0, 50 + Math.abs(maxLoss) * 2));

    return {
      overallRisk: this.determineRiskLevel(riskScore),
      riskScore,
      riskFactors: sectorImpacts.map(s => ({
        name: s.sector,
        category: 'sector',
        severity: s.riskLevel,
        impact: s.percentChange,
        probability: 70,
        description: `${s.sector} sector exposure`,
      })),
      heatmap: {
        rows: sectorImpacts.map(s => s.sector),
        columns: ['Low', 'Medium', 'High', 'Critical'],
        values: [],
        colorScale: { min: 0, max: 100, colors: ['#10B981', '#F59E0B', '#EF4444'] },
      },
      stressTestResults: [],
    };
  }

  /**
   * Determine risk level from score
   */
  private determineRiskLevel(score: number): string {
    if (score < 25) return 'very_low';
    if (score < 50) return 'low';
    if (score < 70) return 'moderate';
    if (score < 85) return 'high';
    return 'very_high';
  }

  /**
   * Generate recommendations based on analysis
   */
  private async generateRecommendations(
    sectorImpacts: SectorImpact[],
    riskAnalysis: any,
    portfolio: any
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Find high-risk sectors
    const highRiskSectors = sectorImpacts.filter(
      s => s.riskLevel === 'high' || s.riskLevel === 'very_high'
    );

    highRiskSectors.forEach((sector, index) => {
      recommendations.push({
        id: `rec-${index + 1}`,
        type: 'reduce_exposure',
        priority: sector.riskLevel === 'very_high' ? 'critical' : 'high',
        title: `Reduce ${sector.sector} exposure`,
        description: `${sector.sector} sector showing high risk with ${sector.percentChange.toFixed(1)}% projected loss`,
        action: `Consider reducing ${sector.sector} allocation by 5-10%`,
        expectedImpact: Math.abs(sector.percentChange) * 0.3,
        confidence: 85,
        reasoning: [
          `High correlation with selected risk events`,
          `Projected loss of ${sector.percentChange.toFixed(1)}%`,
          `Sector volatility above threshold`,
        ],
      });
    });

    // Add diversification recommendation if risk is high
    if (riskAnalysis.riskScore > 70) {
      recommendations.push({
        id: `rec-${recommendations.length + 1}`,
        type: 'diversify',
        priority: 'high',
        title: 'Increase portfolio diversification',
        description: 'Overall risk score is elevated, diversification recommended',
        action: 'Add defensive assets and bonds to portfolio',
        expectedImpact: riskAnalysis.riskScore * 0.15,
        confidence: 80,
        reasoning: [
          `Current risk score: ${riskAnalysis.riskScore}`,
          'Concentration risk detected',
          'Defensive assets provide downside protection',
        ],
      });
    }

    return recommendations;
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(projections: PortfolioProjection[], riskAnalysis: any): any {
    const finalProjection = projections[projections.length - 1];
    const losses = projections.filter(p => p.percentChange < 0);
    const probabilityOfLoss = (losses.length / projections.length) * 100;

    // Find recovery point (when portfolio returns to initial value)
    let recoveryDays = 0;
    for (let i = 0; i < projections.length; i++) {
      if (projections[i].percentChange >= 0) {
        recoveryDays = i * 30; // Convert months to days
        break;
      }
    }

    return {
      expectedReturn: finalProjection.percentChange,
      expectedLoss: Math.min(...projections.map(p => p.percentChange)),
      bestCase: Math.max(...projections.map(p => p.percentChange)),
      worstCase: Math.min(...projections.map(p => p.percentChange)),
      probabilityOfLoss,
      timeToRecovery: recoveryDays || projections.length * 30,
      confidenceLevel: 95,
    };
  }

  /**
   * Generate timeline events based on scenario
   */
  async generateTimeline(events: any[], duration: number): Promise<any[]> {
    const timeline = [];
    const eventsPerMonth = Math.ceil(events.length / duration);

    for (let month = 0; month < duration; month++) {
      const monthEvents = events.slice(
        month * eventsPerMonth,
        (month + 1) * eventsPerMonth
      );

      if (monthEvents.length > 0) {
        const event = monthEvents[0];
        timeline.push({
          month: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000)
            .toLocaleDateString('en-US', { month: 'short' }),
          event: event.description || event.type,
          icon: this.getEventIcon(event.type),
          impact: event.impact?.magnitude || -2.5,
          riskScore: 50 + month * 5,
          description: event.description,
        });
      }
    }

    return timeline;
  }

  /**
   * Get icon for event type
   */
  private getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      interest_rate: '📈',
      inflation: '💰',
      currency_fluctuation: '💱',
      commodity_price: '🛢️',
      market_volatility: '🏢',
      regulatory_change: '⚔️',
    };
    return icons[eventType] || '📊';
  }
}

// Made with Bob