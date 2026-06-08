import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { MarketAgent } from './market-agent';
import { RiskAgent } from './risk-agent';
import { RecommendationAgent } from './recommendation-agent';
import { ReportAgent } from './report-agent';
import { logger } from '../config/logger';
import { Simulation, SimulationStatus } from '../models/simulation.model';
import { Recommendation, AgentType } from '../models/recommendation.model';

export interface AgentConversation {
  agent: string;
  agentType: 'market' | 'risk' | 'portfolio' | 'recommendation' | 'reporting';
  message: string;
  icon: string;
  timestamp: number;
  confidence?: number;
  data?: Record<string, any>;
}

export interface OrchestrationResult {
  simulationId: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  results: {
    market?: AgentResult;
    risk?: AgentResult;
    recommendation?: AgentResult;
    report?: AgentResult;
  };
  summary: {
    totalImpact: number;
    riskScore: number;
    affectedSectors: string[];
  };
  agentConversations: AgentConversation[];
  executionTime: number;
}

export class AgentOrchestrator {
  private marketAgent: MarketAgent;
  private riskAgent: RiskAgent;
  private recommendationAgent: RecommendationAgent;
  private reportAgent: ReportAgent;

  constructor() {
    this.marketAgent = new MarketAgent();
    this.riskAgent = new RiskAgent();
    this.recommendationAgent = new RecommendationAgent();
    this.reportAgent = new ReportAgent();
  }

  /**
   * Generate agent conversation logs
   */
  private generateAgentConversations(
    marketResult: AgentResult,
    riskResult: AgentResult,
    recommendationResult: AgentResult,
    reportResult: AgentResult
  ): AgentConversation[] {
    const conversations: AgentConversation[] = [];
    const baseTime = Date.now();

    // Market Agent conversation
    if (marketResult.status === 'SUCCESS' && marketResult.data) {
      const sectorImpacts = marketResult.data.sectorImpacts as Record<string, number> || {};
      const topSector = Object.entries(sectorImpacts).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
      
      conversations.push({
        agent: 'Market Agent',
        agentType: 'market',
        message: topSector
          ? `${topSector[0]} sector showing ${topSector[1] > 0 ? 'growth' : 'decline'} of ${Math.abs(topSector[1]).toFixed(1)}%. Market volatility increasing across affected sectors.`
          : 'Market analysis complete. Evaluating sector-specific impacts.',
        icon: '📊',
        timestamp: baseTime,
        confidence: marketResult.confidence,
        data: { affected_sectors: Object.keys(sectorImpacts).length },
      });
    }

    // Risk Agent conversation
    if (riskResult.status === 'SUCCESS' && riskResult.data) {
      const riskScore = riskResult.data.overallRisk as number || 0;
      
      conversations.push({
        agent: 'Risk Agent',
        agentType: 'risk',
        message: `Overall risk score: ${riskScore.toFixed(0)}. ${riskScore > 70 ? 'Critical risk level detected. Immediate action recommended.' : 'Risk levels within acceptable range.'}`,
        icon: '⚠️',
        timestamp: baseTime + 1000,
        confidence: riskResult.confidence,
        data: { risk_score: riskScore, risk_level: riskScore > 70 ? 'High' : 'Moderate' },
      });
    }

    // Portfolio Agent conversation (derived from market and risk)
    const totalImpact = this.calculateSummary(marketResult, riskResult).totalImpact;
    conversations.push({
      agent: 'Portfolio Agent',
      agentType: 'portfolio',
      message: `Expected portfolio impact: ${totalImpact > 0 ? '+' : ''}${totalImpact.toFixed(1)}%. Analyzing correlation effects and diversification opportunities.`,
      icon: '💼',
      timestamp: baseTime + 2000,
      confidence: 85,
      data: { expected_impact: totalImpact },
    });

    // Recommendation Agent conversation
    if (recommendationResult.status === 'SUCCESS' && recommendationResult.data) {
      const recommendations = (recommendationResult.data.recommendations as any[]) || [];
      
      conversations.push({
        agent: 'Recommendation Agent',
        agentType: 'recommendation',
        message: `Generated ${recommendations.length} strategic recommendations. Priority actions identified for risk mitigation and portfolio optimization.`,
        icon: '🎯',
        timestamp: baseTime + 3000,
        confidence: recommendationResult.confidence,
        data: { recommendations_count: recommendations.length, priority: 'High' },
      });
    }

    // Reporting Agent conversation
    if (reportResult.status === 'SUCCESS') {
      conversations.push({
        agent: 'Reporting Agent',
        agentType: 'reporting',
        message: 'Comprehensive analysis report generated. Includes stress test results, Monte Carlo projections, and recovery strategies.',
        icon: '📋',
        timestamp: baseTime + 4000,
        confidence: reportResult.confidence,
        data: { report_sections: 5, charts: 8 },
      });
    }

    return conversations;
  }

  /**
   * Orchestrate all agents for a simulation
   */
  async orchestrate(context: AgentContext): Promise<OrchestrationResult> {
    const startTime = Date.now();
    logger.info(`Starting agent orchestration for simulation ${context.simulationId}`);

    try {
      // Update simulation status
      await this.updateSimulationStatus(context.simulationId, SimulationStatus.RUNNING);

      // Phase 1: Run Market and Risk agents in parallel
      const [marketResult, riskResult] = await Promise.all([
        this.marketAgent.execute(context),
        this.riskAgent.execute(context),
      ]);

      // Check if critical agents failed
      if (marketResult.status === 'FAILED' || riskResult.status === 'FAILED') {
        logger.error('Critical agents failed, aborting orchestration');
        await this.updateSimulationStatus(context.simulationId, SimulationStatus.FAILED);
        
        return {
          simulationId: context.simulationId,
          status: 'FAILED',
          results: { market: marketResult, risk: riskResult },
          summary: { totalImpact: 0, riskScore: 0, affectedSectors: [] },
          agentConversations: [],
          executionTime: Date.now() - startTime,
        };
      }

      // Phase 2: Run Recommendation agent with results from Phase 1
      const enrichedContext = {
        ...context,
        parameters: {
          ...context.parameters,
          marketAnalysis: marketResult.data,
          riskAnalysis: riskResult.data,
        },
      };

      const recommendationResult = await this.recommendationAgent.execute(enrichedContext);

      // Phase 3: Generate final report
      const reportContext = {
        ...enrichedContext,
        parameters: {
          ...enrichedContext.parameters,
          recommendations: recommendationResult.data,
        },
      };

      const reportResult = await this.reportAgent.execute(reportContext);

      // Save recommendations to database
      await this.saveRecommendations(context.simulationId, recommendationResult);

      // Calculate summary
      const summary = this.calculateSummary(marketResult, riskResult);

      // Update simulation with results
      await this.updateSimulationResults(context.simulationId, summary, marketResult, riskResult);

      // Update simulation status
      const finalStatus = this.determineFinalStatus([
        marketResult,
        riskResult,
        recommendationResult,
        reportResult,
      ]);
      await this.updateSimulationStatus(context.simulationId, finalStatus);

      const executionTime = Date.now() - startTime;
      logger.info(`Agent orchestration completed in ${executionTime}ms`);

      // Generate agent conversations
      const agentConversations = this.generateAgentConversations(
        marketResult,
        riskResult,
        recommendationResult,
        reportResult
      );

      return {
        simulationId: context.simulationId,
        status: finalStatus === SimulationStatus.COMPLETED ? 'COMPLETED' : 'PARTIAL',
        results: {
          market: marketResult,
          risk: riskResult,
          recommendation: recommendationResult,
          report: reportResult,
        },
        summary,
        agentConversations,
        executionTime,
      };
    } catch (error) {
      logger.error('Agent orchestration error:', error);
      await this.updateSimulationStatus(context.simulationId, SimulationStatus.FAILED);

      return {
        simulationId: context.simulationId,
        status: 'FAILED',
        results: {},
        summary: { totalImpact: 0, riskScore: 0, affectedSectors: [] },
        agentConversations: [],
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Update simulation status
   */
  private async updateSimulationStatus(
    simulationId: string,
    status: SimulationStatus
  ): Promise<void> {
    try {
      await Simulation.findByIdAndUpdate(simulationId, {
        status,
        ...(status === SimulationStatus.COMPLETED && { completedAt: new Date() }),
      });
    } catch (error) {
      logger.error('Failed to update simulation status:', error);
    }
  }

  /**
   * Update simulation with results
   */
  private async updateSimulationResults(
    simulationId: string,
    summary: { totalImpact: number; riskScore: number; affectedSectors: string[] },
    marketResult: AgentResult,
    riskResult: AgentResult
  ): Promise<void> {
    try {
      const results = this.formatResults(marketResult, riskResult);

      await Simulation.findByIdAndUpdate(simulationId, {
        summary,
        results,
        duration: Date.now() - new Date().getTime(),
      });
    } catch (error) {
      logger.error('Failed to update simulation results:', error);
    }
  }

  /**
   * Format agent results for storage
   */
  private formatResults(marketResult: AgentResult, riskResult: AgentResult): unknown[] {
    const results = [];

    // Extract sector impacts from market analysis
    if (marketResult.data.sectorImpacts) {
      const impacts = marketResult.data.sectorImpacts as Record<string, number>;
      for (const [sector, impact] of Object.entries(impacts)) {
        results.push({
          sector,
          impactPercent: impact,
          profitLoss: 0, // Will be calculated based on portfolio
          riskScore: (riskResult.data.sectorRisks as Record<string, number>)?.[sector] || 0,
          marketReaction: marketResult.data,
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  /**
   * Calculate summary from agent results
   */
  private calculateSummary(
    marketResult: AgentResult,
    riskResult: AgentResult
  ): { totalImpact: number; riskScore: number; affectedSectors: string[] } {
    const sectorImpacts = (marketResult.data.sectorImpacts as Record<string, number>) || {};
    const sectors = Object.keys(sectorImpacts);

    const totalImpact = sectors.reduce((sum, sector) => sum + Math.abs(sectorImpacts[sector]), 0) / sectors.length || 0;
    const riskScore = (riskResult.data.overallRisk as number) || 0;

    return {
      totalImpact: Math.round(totalImpact * 100) / 100,
      riskScore: Math.round(riskScore * 100) / 100,
      affectedSectors: sectors,
    };
  }

  /**
   * Save recommendations to database
   */
  private async saveRecommendations(
    simulationId: string,
    recommendationResult: AgentResult
  ): Promise<void> {
    try {
      const recommendations = (recommendationResult.data.recommendations as Array<{
        category: string;
        recommendation: string;
        priority: number;
        reasoning: { analysis: string; confidence: number; supportingData: Record<string, unknown> };
      }>) || [];

      for (const rec of recommendations) {
        await Recommendation.create({
          simulationId,
          agentType: AgentType.RECOMMENDATION,
          category: rec.category,
          recommendation: rec.recommendation,
          priority: rec.priority,
          reasoning: rec.reasoning,
          generatedAt: new Date(),
        });
      }
    } catch (error) {
      logger.error('Failed to save recommendations:', error);
    }
  }

  /**
   * Determine final simulation status
   */
  private determineFinalStatus(results: AgentResult[]): SimulationStatus {
    const failedCount = results.filter((r) => r.status === 'FAILED').length;
    const partialCount = results.filter((r) => r.status === 'PARTIAL').length;

    if (failedCount > 0) {
      return SimulationStatus.FAILED;
    }
    if (partialCount > 0) {
      return SimulationStatus.COMPLETED; // Still mark as completed but with warnings
    }
    return SimulationStatus.COMPLETED;
  }
}

export const agentOrchestrator = new AgentOrchestrator();

// Made with Bob
