/**
 * Recommendations Controller
 * Handles recommendation application and tracking
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { RecommendationTrackingService } from '../../../services/recommendation-tracking.service';
import { SimulationEngine } from '../../../services/simulation-engine.service';
import { Recommendation } from '../../../types';

const trackingService = new RecommendationTrackingService();
const simulationEngine = new SimulationEngine();

interface ApplyRecommendationBody {
  recommendationId: string;
  recommendation: Recommendation;
  portfolioId: string;
  currentPortfolio: any;
}

interface GetAppliedRecommendationsQuery {
  status?: string;
  portfolioId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Apply a recommendation
 */
export async function applyRecommendation(
  request: FastifyRequest<{ Body: ApplyRecommendationBody }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { recommendationId, recommendation, portfolioId, currentPortfolio } = request.body;

    // Validate input
    if (!recommendationId || !recommendation || !portfolioId) {
      return reply.code(400).send({ error: 'Missing required fields' });
    }

    // Apply recommendation and create scenario
    const result = await trackingService.applyRecommendation(
      userId,
      recommendationId,
      recommendation,
      portfolioId,
      currentPortfolio
    );

    return reply.code(201).send({
      success: true,
      data: {
        appliedRecommendation: result.appliedRecommendation,
        scenario: result.scenario,
      },
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to apply recommendation',
      message: error.message,
    });
  }
}

/**
 * Get applied recommendations
 */
export async function getAppliedRecommendations(
  request: FastifyRequest<{ Querystring: GetAppliedRecommendationsQuery }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { status, portfolioId, startDate, endDate } = request.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (portfolioId) filters.portfolioId = portfolioId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const recommendations = await trackingService.getAppliedRecommendations(userId, filters);

    return reply.send({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to fetch applied recommendations',
      message: error.message,
    });
  }
}

/**
 * Get recommendation effectiveness summary
 */
export async function getEffectivenessSummary(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const summary = await trackingService.getEffectivenessSummary(userId);

    return reply.send({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to fetch effectiveness summary',
      message: error.message,
    });
  }
}

/**
 * Update recommendation status after simulation
 */
export async function updateRecommendationStatus(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { simulationResults: any; afterPortfolio: any };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params;
    const { simulationResults, afterPortfolio } = request.body;

    const updatedRecommendation = await trackingService.updateRecommendationStatus(
      id,
      simulationResults,
      afterPortfolio
    );

    return reply.send({
      success: true,
      data: updatedRecommendation,
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to update recommendation status',
      message: error.message,
    });
  }
}

/**
 * Revert a recommendation
 */
export async function revertRecommendation(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params;

    const revertedRecommendation = await trackingService.revertRecommendation(id);

    return reply.send({
      success: true,
      data: revertedRecommendation,
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to revert recommendation',
      message: error.message,
    });
  }
}

/**
 * Generate AI recommendations based on portfolio analysis
 */
export async function generateRecommendations(
  request: FastifyRequest<{
    Body: {
      portfolioId: string;
      scenarioId?: string;
      riskTolerance?: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { portfolioId, scenarioId, riskTolerance } = request.body;

    // Mock recommendations for now - in production, this would call AI agents
    const recommendations: Recommendation[] = [
      {
        id: 'rec-1',
        type: 'reduce_exposure',
        priority: 'high',
        title: 'Reduce Banking Sector Exposure',
        description: 'Banking sector showing elevated risk due to interest rate volatility',
        action: 'Consider reducing banking allocation by 5-10%',
        expectedImpact: 3.5,
        confidence: 85,
        reasoning: [
          'Interest rate sensitivity detected',
          'Historical correlation with rate hikes',
          'Current exposure above optimal threshold',
        ],
      },
      {
        id: 'rec-2',
        type: 'diversify',
        priority: 'medium',
        title: 'Increase Portfolio Diversification',
        description: 'Portfolio concentration risk detected in technology sector',
        action: 'Add defensive assets and bonds to portfolio',
        expectedImpact: 2.8,
        confidence: 78,
        reasoning: [
          'Tech sector represents 45% of portfolio',
          'Low correlation assets recommended',
          'Defensive positioning for market uncertainty',
        ],
      },
      {
        id: 'rec-3',
        type: 'rebalance',
        priority: 'low',
        title: 'Rebalance Asset Allocation',
        description: 'Portfolio drift detected from target allocation',
        action: 'Rebalance to restore target asset mix',
        expectedImpact: 1.5,
        confidence: 72,
        reasoning: [
          'Current allocation: 70% equity, 30% bonds',
          'Target allocation: 60% equity, 40% bonds',
          'Rebalancing improves risk-adjusted returns',
        ],
      },
    ];

    return reply.send({
      success: true,
      data: {
        recommendations,
        portfolioId,
        generatedAt: new Date().toISOString(),
        riskTolerance: riskTolerance || 'moderate',
      },
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to generate recommendations',
      message: error.message,
    });
  }
}

// Made with Bob
