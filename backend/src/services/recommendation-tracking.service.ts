/**
 * Recommendation Tracking Service
 * Handles applying recommendations and tracking their effectiveness
 */

import {
  AppliedRecommendation,
  IAppliedRecommendation,
} from '../models/applied-recommendation.model';
import { PortfolioSnapshot, IPortfolioSnapshot } from '../models/portfolio-snapshot.model';
import { Scenario } from '../models/scenario.model';
import { Recommendation } from '../types';
import mongoose from 'mongoose';

export class RecommendationTrackingService {
  /**
   * Apply a recommendation and create a scenario
   */
  async applyRecommendation(
    userId: string,
    recommendationId: string,
    recommendation: Recommendation,
    portfolioId: string,
    currentPortfolio: any
  ): Promise<{ appliedRecommendation: IAppliedRecommendation; scenario: any }> {
    // Create portfolio snapshot before applying
    const beforeSnapshot = await this.createPortfolioSnapshot(
      portfolioId,
      userId,
      currentPortfolio,
      'before_recommendation'
    );

    // Create scenario based on recommendation
    const scenario = await this.createScenarioFromRecommendation(
      userId,
      recommendation,
      portfolioId
    );

    // Create applied recommendation record
    const appliedRecommendation = await AppliedRecommendation.create({
      userId: new mongoose.Types.ObjectId(userId),
      recommendationId,
      recommendationType: recommendation.type,
      priority: recommendation.priority,
      title: recommendation.title,
      description: recommendation.description,
      action: recommendation.action,
      expectedImpact: recommendation.expectedImpact,
      confidence: recommendation.confidence,
      reasoning: recommendation.reasoning,
      scenarioId: scenario._id,
      portfolioId: new mongoose.Types.ObjectId(portfolioId),
      beforeSnapshot: beforeSnapshot._id,
      status: 'active',
      appliedAt: new Date(),
    });

    return {
      appliedRecommendation,
      scenario,
    };
  }

  /**
   * Create a portfolio snapshot
   */
  async createPortfolioSnapshot(
    portfolioId: string,
    userId: string,
    portfolioData: any,
    snapshotType: 'before_recommendation' | 'after_recommendation' | 'periodic'
  ): Promise<IPortfolioSnapshot> {
    const snapshot = await PortfolioSnapshot.create({
      portfolioId: new mongoose.Types.ObjectId(portfolioId),
      userId: new mongoose.Types.ObjectId(userId),
      snapshotType,
      totalValue: portfolioData.totalValue || 0,
      assets: portfolioData.assets || [],
      sectorAllocation: portfolioData.sectorAllocation || {},
      riskMetrics: {
        overallRisk: portfolioData.riskScore || 50,
        volatility: portfolioData.volatility || 15,
        sharpeRatio: portfolioData.sharpeRatio || 1.2,
        beta: portfolioData.beta || 1.0,
        var95: portfolioData.var95 || 0,
      },
      performanceMetrics: {
        totalReturn: portfolioData.totalReturn || 0,
        ytdReturn: portfolioData.ytdReturn || 0,
        monthlyReturn: portfolioData.monthlyReturn || 0,
        annualizedReturn: portfolioData.annualizedReturn || 0,
      },
    });

    return snapshot;
  }

  /**
   * Create a scenario from a recommendation
   */
  private async createScenarioFromRecommendation(
    userId: string,
    recommendation: Recommendation,
    portfolioId: string
  ): Promise<any> {
    // Map recommendation type to event type
    const eventTypeMap: Record<string, string> = {
      reduce_exposure: 'SECTOR_CRASH',
      diversify: 'GLOBAL_CRISIS',
      rebalance: 'INTEREST_RATE_CHANGE',
      hedge: 'CURRENCY_FLUCTUATION',
    };

    const scenario = await Scenario.create({
      name: `Applied: ${recommendation.title}`,
      description: recommendation.description,
      eventType: eventTypeMap[recommendation.type] || 'INTEREST_RATE_CHANGE',
      parameters: {
        severity: recommendation.priority,
        changePercent: recommendation.expectedImpact,
        duration: '3 months',
        customParams: {
          recommendationId: recommendation.id,
          action: recommendation.action,
        },
      },
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      createdBy: new mongoose.Types.ObjectId(userId),
      status: 'ACTIVE',
    });

    return scenario;
  }

  /**
   * Update recommendation status after simulation
   */
  async updateRecommendationStatus(
    appliedRecommendationId: string,
    simulationResults: any,
    afterPortfolio: any
  ): Promise<IAppliedRecommendation> {
    const appliedRec = await AppliedRecommendation.findById(appliedRecommendationId);
    if (!appliedRec) {
      throw new Error('Applied recommendation not found');
    }

    // Create after snapshot
    const afterSnapshot = await this.createPortfolioSnapshot(
      appliedRec.portfolioId.toString(),
      appliedRec.userId.toString(),
      afterPortfolio,
      'after_recommendation'
    );

    // Calculate actual impact
    const beforeSnapshot = await PortfolioSnapshot.findById(appliedRec.beforeSnapshot);
    const beforeValue = beforeSnapshot?.portfolioData?.totalValue;
    const actualImpact = beforeValue
      ? ((afterPortfolio.totalValue - beforeValue) / beforeValue) * 100
      : 0;

    // Calculate effectiveness
    const effectiveness = this.calculateEffectiveness(
      appliedRec.expectedImpact,
      actualImpact,
      appliedRec.confidence
    );

    // Update applied recommendation
    appliedRec.afterSnapshot = afterSnapshot._id;
    appliedRec.actualImpact = actualImpact;
    appliedRec.effectiveness = effectiveness;
    appliedRec.status = 'completed';
    appliedRec.completedAt = new Date();

    await appliedRec.save();

    return appliedRec;
  }

  /**
   * Calculate recommendation effectiveness
   */
  private calculateEffectiveness(
    expectedImpact: number,
    actualImpact: number,
    confidence: number
  ): number {
    // If expected impact was positive (gain) and actual was positive
    if (expectedImpact > 0 && actualImpact > 0) {
      return Math.min(100, (actualImpact / expectedImpact) * 100);
    }

    // If expected impact was negative (loss reduction) and actual was less negative
    if (expectedImpact < 0 && actualImpact > expectedImpact) {
      return Math.min(100, ((expectedImpact - actualImpact) / Math.abs(expectedImpact)) * 100);
    }

    // If recommendation didn't work as expected
    return Math.max(0, confidence - Math.abs(expectedImpact - actualImpact) * 10);
  }

  /**
   * Get applied recommendations for a user
   */
  async getAppliedRecommendations(
    userId: string,
    filters?: {
      status?: string;
      portfolioId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<IAppliedRecommendation[]> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.portfolioId) {
      query.portfolioId = new mongoose.Types.ObjectId(filters.portfolioId);
    }

    if (filters?.startDate || filters?.endDate) {
      query.appliedAt = {};
      if (filters.startDate) {
        query.appliedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.appliedAt.$lte = filters.endDate;
      }
    }

    const recommendations = await AppliedRecommendation.find(query)
      .populate('scenarioId')
      .populate('beforeSnapshot')
      .populate('afterSnapshot')
      .sort({ appliedAt: -1 });

    return recommendations;
  }

  /**
   * Get recommendation effectiveness summary
   */
  async getEffectivenessSummary(userId: string): Promise<any> {
    const recommendations = await AppliedRecommendation.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'completed',
    });

    if (recommendations.length === 0) {
      return {
        totalApplied: 0,
        averageEffectiveness: 0,
        successRate: 0,
        totalImpact: 0,
      };
    }

    const totalEffectiveness = recommendations.reduce(
      (sum, rec) => sum + (rec.effectiveness || 0),
      0
    );
    const averageEffectiveness = totalEffectiveness / recommendations.length;

    const successfulRecs = recommendations.filter((rec) => (rec.effectiveness || 0) >= 70);
    const successRate = (successfulRecs.length / recommendations.length) * 100;

    const totalImpact = recommendations.reduce((sum, rec) => sum + (rec.actualImpact || 0), 0);

    return {
      totalApplied: recommendations.length,
      averageEffectiveness: Math.round(averageEffectiveness),
      successRate: Math.round(successRate),
      totalImpact: Math.round(totalImpact * 100) / 100,
      byPriority: this.groupByPriority(recommendations),
      byType: this.groupByType(recommendations),
    };
  }

  /**
   * Group recommendations by priority
   */
  private groupByPriority(recommendations: IAppliedRecommendation[]): any {
    const grouped: Record<string, any> = {};

    recommendations.forEach((rec) => {
      const priority = rec.priority;
      if (!grouped[priority]) {
        grouped[priority] = {
          count: 0,
          averageEffectiveness: 0,
          totalImpact: 0,
        };
      }

      grouped[priority].count++;
      grouped[priority].averageEffectiveness += rec.effectiveness || 0;
      grouped[priority].totalImpact += rec.actualImpact || 0;
    });

    // Calculate averages
    Object.keys(grouped).forEach((priority) => {
      grouped[priority].averageEffectiveness =
        grouped[priority].averageEffectiveness / grouped[priority].count;
    });

    return grouped;
  }

  /**
   * Group recommendations by type
   */
  private groupByType(recommendations: IAppliedRecommendation[]): any {
    const grouped: Record<string, any> = {};

    recommendations.forEach((rec) => {
      const type = rec.recommendationType;
      if (!grouped[type]) {
        grouped[type] = {
          count: 0,
          averageEffectiveness: 0,
          totalImpact: 0,
        };
      }

      grouped[type].count++;
      grouped[type].averageEffectiveness += rec.effectiveness || 0;
      grouped[type].totalImpact += rec.actualImpact || 0;
    });

    // Calculate averages
    Object.keys(grouped).forEach((type) => {
      grouped[type].averageEffectiveness = grouped[type].averageEffectiveness / grouped[type].count;
    });

    return grouped;
  }

  /**
   * Revert a recommendation
   */
  async revertRecommendation(appliedRecommendationId: string): Promise<IAppliedRecommendation> {
    const appliedRec = await AppliedRecommendation.findById(appliedRecommendationId);
    if (!appliedRec) {
      throw new Error('Applied recommendation not found');
    }

    appliedRec.status = 'reverted';
    appliedRec.completedAt = new Date();

    await appliedRec.save();

    return appliedRec;
  }
}

// Made with Bob
