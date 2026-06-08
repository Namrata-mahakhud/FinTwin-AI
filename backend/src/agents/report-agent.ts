import { BaseAgent, AgentContext } from './base-agent';
import { logger } from '../config/logger';

export class ReportAgent extends BaseAgent {
  constructor() {
    super('REPORT_AGENT');
  }

  protected async process(context: AgentContext): Promise<Record<string, unknown>> {
    this.validateContext(context);

    logger.info('Report Agent compiling final report');

    // Get all analysis from context
    const marketAnalysis = context.parameters.marketAnalysis as Record<string, unknown> | undefined;
    const riskAnalysis = context.parameters.riskAnalysis as Record<string, unknown> | undefined;
    const recommendations = context.parameters.recommendations as Record<string, unknown> | undefined;

    if (!marketAnalysis || !riskAnalysis || !recommendations) {
      throw new Error('All agent analyses required for report generation');
    }

    // Compile executive summary
    const executiveSummary = this.generateExecutiveSummary(
      marketAnalysis,
      riskAnalysis,
      recommendations
    );

    // Generate detailed sections
    const marketSection = this.generateMarketSection(marketAnalysis);
    const riskSection = this.generateRiskSection(riskAnalysis);
    const recommendationSection = this.generateRecommendationSection(recommendations);

    // Generate key insights
    const keyInsights = this.extractKeyInsights(marketAnalysis, riskAnalysis, recommendations);

    // Generate action items
    const actionItems = this.generateActionItems(recommendations);

    return {
      executiveSummary,
      sections: {
        market: marketSection,
        risk: riskSection,
        recommendations: recommendationSection,
      },
      keyInsights,
      actionItems,
      reportTimestamp: new Date().toISOString(),
    };
  }

  protected calculateConfidence(result: Record<string, unknown>): number {
    // Report confidence is high if all sections are present
    const sections = result.sections as Record<string, unknown> | undefined;
    const hasAllSections = sections?.market && sections?.risk && sections?.recommendations;
    const insightCount = ((result.keyInsights as Array<unknown>) || []).length;
    
    return hasAllSections && insightCount > 0 ? 0.9 : 0.7;
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(
    marketAnalysis: Record<string, unknown>,
    riskAnalysis: Record<string, unknown>,
    recommendations: Record<string, unknown>
  ): string {
    const overallRisk = (riskAnalysis.overallRisk as number) || 0;
    const riskLevel = (riskAnalysis.riskLevel as string) || 'MODERATE';
    const marketVolatility = (marketAnalysis.marketVolatility as number) || 0;
    const totalRecommendations = (recommendations.totalRecommendations as number) || 0;
    const highPriorityCount = (recommendations.highPriorityCount as number) || 0;

    return `
Portfolio Analysis Summary:

The simulation reveals a ${riskLevel} risk profile with an overall risk score of ${overallRisk}%. 
Market volatility is projected at ${marketVolatility}%, indicating ${marketVolatility > 50 ? 'elevated' : 'moderate'} market uncertainty.

Our analysis has generated ${totalRecommendations} recommendations, with ${highPriorityCount} requiring immediate attention. 
${highPriorityCount > 0 ? 'Urgent action is recommended to mitigate identified risks.' : 'Portfolio is relatively well-positioned but monitoring is advised.'}

Key areas of focus:
- Risk management and mitigation strategies
- Portfolio rebalancing opportunities
- Sector diversification improvements
- Market volatility preparedness
    `.trim();
  }

  /**
   * Generate market analysis section
   */
  private generateMarketSection(marketAnalysis: Record<string, unknown>): {
    summary: string;
    sectorImpacts: Record<string, number>;
    volatility: number;
    priceMovements: Record<string, unknown>;
  } {
    const sectorImpacts = (marketAnalysis.sectorImpacts as Record<string, number>) || {};
    const volatility = (marketAnalysis.marketVolatility as number) || 0;
    const priceMovements = (marketAnalysis.priceMovements as Record<string, unknown>) || {};

    const mostImpacted = Object.entries(sectorImpacts)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
      .slice(0, 3)
      .map(([sector, impact]) => `${sector} (${impact > 0 ? '+' : ''}${impact.toFixed(1)}%)`)
      .join(', ');

    const summary = `
Market Impact Analysis:

The scenario is expected to create ${volatility > 50 ? 'significant' : 'moderate'} market volatility at ${volatility}%.
Most impacted sectors: ${mostImpacted}.

${Object.keys(sectorImpacts).length} sectors analyzed with varying degrees of impact.
    `.trim();

    return {
      summary,
      sectorImpacts,
      volatility,
      priceMovements,
    };
  }

  /**
   * Generate risk analysis section
   */
  private generateRiskSection(riskAnalysis: Record<string, unknown>): {
    summary: string;
    overallRisk: number;
    riskLevel: string;
    concentrationRisk: number;
    highRiskSectors: string[];
  } {
    const overallRisk = (riskAnalysis.overallRisk as number) || 0;
    const riskLevel = (riskAnalysis.riskLevel as string) || 'MODERATE';
    const concentrationRisk = (riskAnalysis.concentrationRisk as number) || 0;
    const highRiskSectors = ((riskAnalysis.riskPropagation as Record<string, unknown>)?.highRiskSectors as string[]) || [];

    const summary = `
Risk Assessment:

Portfolio risk level: ${riskLevel} (${overallRisk}%)
Concentration risk: ${concentrationRisk}% ${concentrationRisk > 60 ? '(HIGH - Diversification recommended)' : '(Acceptable)'}
High-risk sectors: ${highRiskSectors.length > 0 ? highRiskSectors.join(', ') : 'None identified'}

${overallRisk > 70 ? 'CRITICAL: Immediate risk mitigation required.' : overallRisk > 50 ? 'CAUTION: Monitor risk levels closely.' : 'Risk levels are within acceptable ranges.'}
    `.trim();

    return {
      summary,
      overallRisk,
      riskLevel,
      concentrationRisk,
      highRiskSectors,
    };
  }

  /**
   * Generate recommendations section
   */
  private generateRecommendationSection(recommendations: Record<string, unknown>): {
    summary: string;
    totalCount: number;
    highPriorityCount: number;
    topRecommendations: Array<{ recommendation: string; priority: number }>;
  } {
    const totalCount = (recommendations.totalRecommendations as number) || 0;
    const highPriorityCount = (recommendations.highPriorityCount as number) || 0;
    const allRecommendations = (recommendations.recommendations as Array<{
      recommendation: string;
      priority: number;
    }>) || [];

    const topRecommendations = allRecommendations.slice(0, 5);

    const summary = `
Strategic Recommendations:

Generated ${totalCount} actionable recommendations, including ${highPriorityCount} high-priority items.

${highPriorityCount > 0 ? 'Immediate action required on high-priority recommendations.' : 'Review and implement recommendations as appropriate.'}
    `.trim();

    return {
      summary,
      totalCount,
      highPriorityCount,
      topRecommendations,
    };
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(
    marketAnalysis: Record<string, unknown>,
    riskAnalysis: Record<string, unknown>,
    recommendations: Record<string, unknown>
  ): string[] {
    const insights: string[] = [];

    // Market insights
    const volatility = (marketAnalysis.marketVolatility as number) || 0;
    if (volatility > 60) {
      insights.push(`High market volatility (${volatility}%) indicates increased uncertainty and potential for sharp price movements.`);
    }

    // Risk insights
    const overallRisk = (riskAnalysis.overallRisk as number) || 0;
    const riskLevel = (riskAnalysis.riskLevel as string) || 'MODERATE';
    if (overallRisk > 70) {
      insights.push(`Portfolio risk is at ${riskLevel} level (${overallRisk}%), requiring immediate attention.`);
    }

    const concentrationRisk = (riskAnalysis.concentrationRisk as number) || 0;
    if (concentrationRisk > 60) {
      insights.push(`High concentration risk (${concentrationRisk}%) suggests portfolio is not adequately diversified.`);
    }

    // Recommendation insights
    const highPriorityCount = (recommendations.highPriorityCount as number) || 0;
    if (highPriorityCount > 3) {
      insights.push(`${highPriorityCount} high-priority recommendations indicate multiple areas requiring immediate action.`);
    }

    // Default insight if none generated
    if (insights.length === 0) {
      insights.push('Portfolio is relatively well-positioned with manageable risk levels.');
    }

    return insights;
  }

  /**
   * Generate action items
   */
  private generateActionItems(recommendations: Record<string, unknown>): Array<{
    action: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    timeframe: string;
  }> {
    const allRecommendations = (recommendations.recommendations as Array<{
      recommendation: string;
      priority: number;
      category: string;
    }>) || [];

    return allRecommendations.slice(0, 10).map((rec) => ({
      action: rec.recommendation,
      priority: rec.priority >= 8 ? 'HIGH' : rec.priority >= 5 ? 'MEDIUM' : 'LOW',
      timeframe: rec.priority >= 8 ? 'Immediate' : rec.priority >= 5 ? '1-2 weeks' : '1 month',
    }));
  }
}

// Made with Bob
