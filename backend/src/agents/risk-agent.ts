import { BaseAgent, AgentContext } from './base-agent';
import { Portfolio, IPortfolio } from '../models/portfolio.model';
import { logger } from '../config/logger';

export class RiskAgent extends BaseAgent {
  constructor() {
    super('RISK_AGENT');
  }

  protected async process(context: AgentContext): Promise<Record<string, unknown>> {
    this.validateContext(context);

    // Fetch portfolio details
    const portfolio = await Portfolio.findById(context.portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    logger.info(`Risk Agent analyzing portfolio: ${portfolio.name}`);

    // Get market analysis from context if available
    const marketAnalysis = context.parameters.marketAnalysis as Record<string, unknown> | undefined;

    // Calculate various risk metrics
    const overallRisk = this.calculateOverallRisk(portfolio, marketAnalysis);
    const sectorRisks = this.calculateSectorRisks(portfolio, marketAnalysis);
    const concentrationRisk = this.calculateConcentrationRisk(portfolio);
    const volatilityRisk = this.calculateVolatilityRisk(marketAnalysis);
    const riskPropagation = this.analyzeRiskPropagation(sectorRisks);

    return {
      overallRisk,
      sectorRisks,
      concentrationRisk,
      volatilityRisk,
      riskPropagation,
      riskLevel: this.getRiskLevel(overallRisk),
      analysisTimestamp: new Date().toISOString(),
    };
  }

  protected calculateConfidence(result: Record<string, unknown>): number {
    // Confidence based on data completeness
    const hasAllMetrics = result.overallRisk && result.sectorRisks && result.concentrationRisk;
    const riskScore = (result.overallRisk as number) || 0;

    // Higher confidence for moderate risk scores (more predictable)
    const riskFactor = 1 - Math.abs(riskScore - 50) / 50;

    return hasAllMetrics ? 0.75 + riskFactor * 0.25 : 0.6;
  }

  /**
   * Calculate overall portfolio risk score (0-100)
   */
  private calculateOverallRisk(
    portfolio: IPortfolio,
    marketAnalysis?: Record<string, unknown>
  ): number {
    let riskScore = 0;

    // Base risk from portfolio risk appetite
    const appetiteRisk: Record<string, number> = {
      CONSERVATIVE: 20,
      MODERATE: 50,
      AGGRESSIVE: 80,
    };

    riskScore += (appetiteRisk[portfolio.riskAppetite] || 50) * 0.3;

    // Risk from market volatility
    if (marketAnalysis?.marketVolatility) {
      const volatility = marketAnalysis.marketVolatility as number;
      riskScore += volatility * 0.4;
    } else {
      riskScore += 30 * 0.4; // Default volatility
    }

    // Risk from concentration
    const concentrationRisk = this.calculateConcentrationRisk(portfolio);
    riskScore += concentrationRisk * 0.3;

    return Math.min(Math.round(riskScore), 100);
  }

  /**
   * Calculate risk for each sector
   */
  private calculateSectorRisks(
    portfolio: IPortfolio,
    marketAnalysis?: Record<string, unknown>
  ): Record<string, number> {
    const sectorRisks: Record<string, number> = {};
    const sectorImpacts = (marketAnalysis?.sectorImpacts as Record<string, number>) || {};

    // Group assets by sector/type
    const sectorAllocations: Record<string, number> = {};
    for (const asset of portfolio.assets) {
      const sector = asset.assetType.toUpperCase();
      sectorAllocations[sector] = (sectorAllocations[sector] || 0) + asset.allocationPercent;
    }

    // Calculate risk for each sector
    for (const [sector, allocation] of Object.entries(sectorAllocations)) {
      const marketImpact = Math.abs(sectorImpacts[sector] || 0);
      const allocationRisk = allocation > 30 ? (allocation - 30) * 2 : 0; // Penalty for over-concentration

      sectorRisks[sector] = Math.min(Math.round(marketImpact * 2 + allocationRisk), 100);
    }

    return sectorRisks;
  }

  /**
   * Calculate concentration risk
   */
  private calculateConcentrationRisk(portfolio: IPortfolio): number {
    if (portfolio.assets.length === 0) return 0;

    // Calculate Herfindahl-Hirschman Index (HHI)
    const hhi = portfolio.assets.reduce((sum, asset) => {
      return sum + Math.pow(asset.allocationPercent, 2);
    }, 0);

    // Normalize HHI to 0-100 scale
    // HHI ranges from 0 (perfect diversification) to 10000 (single asset)
    const normalizedHHI = (hhi / 10000) * 100;

    return Math.round(normalizedHHI);
  }

  /**
   * Calculate volatility risk from market analysis
   */
  private calculateVolatilityRisk(marketAnalysis?: Record<string, unknown>): number {
    if (!marketAnalysis?.marketVolatility) {
      return 50; // Default moderate volatility risk
    }

    const volatility = marketAnalysis.marketVolatility as number;
    return Math.min(Math.round(volatility), 100);
  }

  /**
   * Analyze how risk propagates across sectors
   */
  private analyzeRiskPropagation(sectorRisks: Record<string, number>): {
    highRiskSectors: string[];
    correlatedSectors: string[][];
    propagationScore: number;
  } {
    const highRiskSectors = Object.entries(sectorRisks)
      .filter(([_, risk]) => risk > 70)
      .map(([sector]) => sector);

    // Simplified correlation analysis
    const correlatedSectors: string[][] = [];
    const sectors = Object.keys(sectorRisks);

    // Banking and Real Estate are typically correlated
    if (sectors.includes('BANKING') && sectors.includes('REAL_ESTATE')) {
      correlatedSectors.push(['BANKING', 'REAL_ESTATE']);
    }

    // Technology and Consumer sectors correlation
    if (sectors.includes('TECHNOLOGY') && sectors.includes('CONSUMER')) {
      correlatedSectors.push(['TECHNOLOGY', 'CONSUMER']);
    }

    // Calculate propagation score
    const avgRisk = Object.values(sectorRisks).reduce((a, b) => a + b, 0) / sectors.length;
    const propagationScore = Math.round(
      (highRiskSectors.length / sectors.length) * 50 + avgRisk * 0.5
    );

    return {
      highRiskSectors,
      correlatedSectors,
      propagationScore: Math.min(propagationScore, 100),
    };
  }

  /**
   * Get risk level description
   */
  private getRiskLevel(riskScore: number): string {
    if (riskScore < 25) return 'LOW';
    if (riskScore < 50) return 'MODERATE';
    if (riskScore < 75) return 'HIGH';
    return 'CRITICAL';
  }
}

// Made with Bob
