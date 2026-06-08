import { BaseAgent, AgentContext } from './base-agent';
import { RecommendationCategory } from '../models/recommendation.model';
import { logger } from '../config/logger';

export class RecommendationAgent extends BaseAgent {
  constructor() {
    super('RECOMMENDATION_AGENT');
  }

  protected async process(context: AgentContext): Promise<Record<string, unknown>> {
    this.validateContext(context);

    logger.info('Recommendation Agent generating insights');

    // Get analysis from previous agents
    const marketAnalysis = context.parameters.marketAnalysis as Record<string, unknown> | undefined;
    const riskAnalysis = context.parameters.riskAnalysis as Record<string, unknown> | undefined;

    if (!marketAnalysis || !riskAnalysis) {
      throw new Error('Market and risk analysis required for recommendations');
    }

    // Generate recommendations
    const recommendations = [
      ...this.generateRiskMitigationRecommendations(riskAnalysis),
      ...this.generateRebalanceRecommendations(marketAnalysis, riskAnalysis),
      ...this.generateDiversificationRecommendations(riskAnalysis),
      ...this.generateFutureWarnings(marketAnalysis, riskAnalysis),
    ];

    // Sort by priority
    recommendations.sort((a, b) => b.priority - a.priority);

    return {
      recommendations,
      totalRecommendations: recommendations.length,
      highPriorityCount: recommendations.filter((r) => r.priority >= 8).length,
      analysisTimestamp: new Date().toISOString(),
    };
  }

  protected calculateConfidence(result: Record<string, unknown>): number {
    const recommendations = (result.recommendations as Array<unknown>) || [];
    const avgPriority = recommendations.reduce((sum: number, rec: any) => sum + (rec.priority || 0), 0) / recommendations.length;
    
    // Higher confidence when we have clear high-priority recommendations
    return recommendations.length > 0 ? 0.7 + (avgPriority / 10) * 0.3 : 0.5;
  }

  /**
   * Generate risk mitigation recommendations
   */
  private generateRiskMitigationRecommendations(
    riskAnalysis: Record<string, unknown>
  ): Array<{
    category: string;
    recommendation: string;
    priority: number;
    reasoning: { analysis: string; confidence: number; supportingData: Record<string, unknown> };
  }> {
    const recommendations = [];
    const overallRisk = (riskAnalysis.overallRisk as number) || 0;
    const riskLevel = (riskAnalysis.riskLevel as string) || 'MODERATE';
    const highRiskSectors = ((riskAnalysis.riskPropagation as Record<string, unknown>)?.highRiskSectors as string[]) || [];

    if (overallRisk > 70) {
      recommendations.push({
        category: RecommendationCategory.RISK_MITIGATION,
        recommendation: `Critical: Reduce overall portfolio risk from ${overallRisk}% to below 60%. Consider moving to more conservative assets.`,
        priority: 10,
        reasoning: {
          analysis: `Portfolio risk level is ${riskLevel} with score of ${overallRisk}%, which exceeds safe thresholds.`,
          confidence: 0.9,
          supportingData: { overallRisk, riskLevel },
        },
      });
    }

    if (highRiskSectors.length > 0) {
      recommendations.push({
        category: RecommendationCategory.RISK_MITIGATION,
        recommendation: `Reduce exposure to high-risk sectors: ${highRiskSectors.join(', ')}. Consider hedging strategies.`,
        priority: 8,
        reasoning: {
          analysis: `${highRiskSectors.length} sectors showing elevated risk levels above 70%.`,
          confidence: 0.85,
          supportingData: { highRiskSectors },
        },
      });
    }

    const concentrationRisk = (riskAnalysis.concentrationRisk as number) || 0;
    if (concentrationRisk > 60) {
      recommendations.push({
        category: RecommendationCategory.RISK_MITIGATION,
        recommendation: `Portfolio is over-concentrated (${concentrationRisk}% concentration index). Diversify across more assets.`,
        priority: 7,
        reasoning: {
          analysis: 'High concentration increases vulnerability to sector-specific shocks.',
          confidence: 0.8,
          supportingData: { concentrationRisk },
        },
      });
    }

    return recommendations;
  }

  /**
   * Generate portfolio rebalance recommendations
   */
  private generateRebalanceRecommendations(
    marketAnalysis: Record<string, unknown>,
    riskAnalysis: Record<string, unknown>
  ): Array<{
    category: string;
    recommendation: string;
    priority: number;
    reasoning: { analysis: string; confidence: number; supportingData: Record<string, unknown> };
  }> {
    const recommendations = [];
    const sectorImpacts = (marketAnalysis.sectorImpacts as Record<string, number>) || {};
    const sectorRisks = (riskAnalysis.sectorRisks as Record<string, number>) || {};

    // Find sectors with negative impact
    const negativeSectors = Object.entries(sectorImpacts)
      .filter(([_, impact]) => impact < -10)
      .map(([sector]) => sector);

    if (negativeSectors.length > 0) {
      recommendations.push({
        category: RecommendationCategory.PORTFOLIO_REBALANCE,
        recommendation: `Rebalance away from negatively impacted sectors: ${negativeSectors.join(', ')}. Consider reallocating to defensive sectors.`,
        priority: 7,
        reasoning: {
          analysis: `${negativeSectors.length} sectors showing significant negative impact (>10%).`,
          confidence: 0.75,
          supportingData: { negativeSectors, sectorImpacts },
        },
      });
    }

    // Find sectors with positive impact and low risk
    const opportunitySectors = Object.entries(sectorImpacts)
      .filter(([sector, impact]) => impact > 5 && (sectorRisks[sector] || 0) < 50)
      .map(([sector]) => sector);

    if (opportunitySectors.length > 0) {
      recommendations.push({
        category: RecommendationCategory.PORTFOLIO_REBALANCE,
        recommendation: `Consider increasing allocation to opportunity sectors: ${opportunitySectors.join(', ')}. These show positive outlook with manageable risk.`,
        priority: 6,
        reasoning: {
          analysis: 'Identified sectors with positive market impact and acceptable risk levels.',
          confidence: 0.7,
          supportingData: { opportunitySectors },
        },
      });
    }

    return recommendations;
  }

  /**
   * Generate diversification recommendations
   */
  private generateDiversificationRecommendations(
    riskAnalysis: Record<string, unknown>
  ): Array<{
    category: string;
    recommendation: string;
    priority: number;
    reasoning: { analysis: string; confidence: number; supportingData: Record<string, unknown> };
  }> {
    const recommendations = [];
    const correlatedSectors = ((riskAnalysis.riskPropagation as Record<string, unknown>)?.correlatedSectors as string[][]) || [];

    if (correlatedSectors.length > 0) {
      recommendations.push({
        category: RecommendationCategory.SECTOR_DIVERSIFICATION,
        recommendation: `Diversify across uncorrelated sectors. Currently have ${correlatedSectors.length} correlated sector pairs that move together.`,
        priority: 6,
        reasoning: {
          analysis: 'Correlated sectors amplify risk during market downturns.',
          confidence: 0.75,
          supportingData: { correlatedSectors },
        },
      });
    }

    const concentrationRisk = (riskAnalysis.concentrationRisk as number) || 0;
    if (concentrationRisk > 40) {
      recommendations.push({
        category: RecommendationCategory.SECTOR_DIVERSIFICATION,
        recommendation: 'Add exposure to alternative asset classes (commodities, bonds, international markets) to improve diversification.',
        priority: 5,
        reasoning: {
          analysis: 'Portfolio lacks sufficient diversification across asset classes.',
          confidence: 0.7,
          supportingData: { concentrationRisk },
        },
      });
    }

    return recommendations;
  }

  /**
   * Generate future warnings
   */
  private generateFutureWarnings(
    marketAnalysis: Record<string, unknown>,
    riskAnalysis: Record<string, unknown>
  ): Array<{
    category: string;
    recommendation: string;
    priority: number;
    reasoning: { analysis: string; confidence: number; supportingData: Record<string, unknown> };
  }> {
    const recommendations = [];
    const marketVolatility = (marketAnalysis.marketVolatility as number) || 0;
    const overallRisk = (riskAnalysis.overallRisk as number) || 0;

    if (marketVolatility > 60) {
      recommendations.push({
        category: RecommendationCategory.FUTURE_WARNING,
        recommendation: `Warning: High market volatility (${marketVolatility}%) expected. Consider defensive positioning and stop-loss strategies.`,
        priority: 8,
        reasoning: {
          analysis: 'Elevated volatility increases probability of sharp price movements.',
          confidence: 0.8,
          supportingData: { marketVolatility },
        },
      });
    }

    if (overallRisk > 60 && marketVolatility > 40) {
      recommendations.push({
        category: RecommendationCategory.FUTURE_WARNING,
        recommendation: 'Caution: Combination of high portfolio risk and market volatility creates elevated downside risk. Monitor positions closely.',
        priority: 9,
        reasoning: {
          analysis: 'Dual risk factors significantly increase potential for losses.',
          confidence: 0.85,
          supportingData: { overallRisk, marketVolatility },
        },
      });
    }

    return recommendations;
  }
}

// Made with Bob
