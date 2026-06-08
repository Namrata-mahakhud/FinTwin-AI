/**
 * Dashboard Service
 * Aggregates data for the dashboard view
 */

import { AppliedRecommendation } from '../models/applied-recommendation.model';
import { Scenario } from '../models/scenario.model';
import { Simulation } from '../models/simulation.model';
import { RecommendationTrackingService } from './recommendation-tracking.service';
import mongoose from 'mongoose';

const trackingService = new RecommendationTrackingService();

export class DashboardService {
  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(userId: string): Promise<any> {
    const [
      portfolioSummary,
      appliedRecommendations,
      recentScenarios,
      systemMetrics,
      effectivenessSummary,
    ] = await Promise.all([
      this.getPortfolioSummary(userId),
      this.getAppliedRecommendationsSummary(userId),
      this.getRecentScenarios(userId),
      this.getSystemMetrics(userId),
      trackingService.getEffectivenessSummary(userId),
    ]);

    return {
      portfolioSummary,
      appliedRecommendations,
      recentScenarios,
      systemMetrics,
      effectivenessSummary,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get portfolio summary
   */
  private async getPortfolioSummary(userId: string): Promise<any> {
    // Mock data - in production, this would fetch from Portfolio model
    return {
      totalValue: 2450000,
      dailyChange: 12500,
      dailyChangePercent: 0.51,
      weeklyChange: 45000,
      weeklyChangePercent: 1.87,
      monthlyChange: -23000,
      monthlyChangePercent: -0.93,
      riskScore: 65,
      riskLevel: 'moderate',
      assets: [
        { symbol: 'AAPL', value: 450000, allocation: 18.37 },
        { symbol: 'MSFT', value: 380000, allocation: 15.51 },
        { symbol: 'GOOGL', value: 320000, allocation: 13.06 },
        { symbol: 'AMZN', value: 290000, allocation: 11.84 },
        { symbol: 'TSLA', value: 250000, allocation: 10.20 },
      ],
      sectors: [
        { name: 'Technology', value: 1100000, allocation: 44.90 },
        { name: 'Banking', value: 550000, allocation: 22.45 },
        { name: 'Healthcare', value: 450000, allocation: 18.37 },
        { name: 'Energy', value: 350000, allocation: 14.29 },
      ],
    };
  }

  /**
   * Get applied recommendations summary
   */
  private async getAppliedRecommendationsSummary(userId: string): Promise<any> {
    const recommendations = await AppliedRecommendation.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate('scenarioId')
      .sort({ appliedAt: -1 })
      .limit(10);

    const active = recommendations.filter((r) => r.status === 'active');
    const completed = recommendations.filter((r) => r.status === 'completed');

    return {
      total: recommendations.length,
      active: active.length,
      completed: completed.length,
      recent: recommendations.slice(0, 5).map((rec) => ({
        id: rec._id,
        title: rec.title,
        type: rec.recommendationType,
        priority: rec.priority,
        status: rec.status,
        appliedAt: rec.appliedAt,
        effectiveness: rec.effectiveness,
        scenarioName: (rec.scenarioId as any)?.name || 'Unknown',
      })),
    };
  }

  /**
   * Get recent scenarios
   */
  private async getRecentScenarios(userId: string): Promise<any> {
    const scenarios = await Scenario.find({
      createdBy: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return scenarios.map((scenario) => ({
      id: scenario._id,
      name: scenario.name,
      eventType: scenario.eventType,
      status: scenario.status,
      createdAt: scenario.createdAt,
      targetDate: scenario.targetDate,
    }));
  }

  /**
   * Get system metrics
   */
  private async getSystemMetrics(userId: string): Promise<any> {
    const [scenarioCount, simulationCount, recommendationCount] = await Promise.all([
      Scenario.countDocuments({ createdBy: new mongoose.Types.ObjectId(userId) }),
      Simulation.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
      AppliedRecommendation.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    // Get recent activity
    const recentActivity = await this.getRecentActivity(userId);

    return {
      scenarios: {
        total: scenarioCount,
        active: await Scenario.countDocuments({
          createdBy: new mongoose.Types.ObjectId(userId),
          status: 'ACTIVE',
        }),
        draft: await Scenario.countDocuments({
          createdBy: new mongoose.Types.ObjectId(userId),
          status: 'DRAFT',
        }),
      },
      simulations: {
        total: simulationCount,
        completed: await Simulation.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
        }),
        running: await Simulation.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          status: 'running',
        }),
      },
      recommendations: {
        total: recommendationCount,
        active: await AppliedRecommendation.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          status: 'active',
        }),
        completed: await AppliedRecommendation.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
        }),
      },
      recentActivity,
    };
  }

  /**
   * Get recent activity
   */
  private async getRecentActivity(userId: string): Promise<any[]> {
    const [scenarios, simulations, recommendations] = await Promise.all([
      Scenario.find({ createdBy: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Simulation.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      AppliedRecommendation.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ appliedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const activities = [
      ...scenarios.map((s) => ({
        type: 'scenario',
        action: 'created',
        description: `Created scenario: ${s.name}`,
        timestamp: s.createdAt,
      })),
      ...simulations.map((s) => ({
        type: 'simulation',
        action: 'ran',
        description: `Ran simulation for scenario`,
        timestamp: s.createdAt,
      })),
      ...recommendations.map((r) => ({
        type: 'recommendation',
        action: 'applied',
        description: `Applied recommendation: ${r.title}`,
        timestamp: r.appliedAt,
      })),
    ];

    // Sort by timestamp and return top 10
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  /**
   * Get portfolio performance data for charts
   */
  async getPortfolioPerformance(userId: string, days: number = 30): Promise<any> {
    // Mock data - in production, this would fetch historical data
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate mock performance data with some volatility
      const baseValue = 2450000;
      const volatility = Math.sin(i / 5) * 50000 + Math.random() * 30000;
      const value = baseValue + volatility;

      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        change: Math.round(volatility),
        changePercent: ((volatility / baseValue) * 100).toFixed(2),
      });
    }

    return data;
  }

  /**
   * Get risk metrics over time
   */
  async getRiskMetrics(userId: string, days: number = 30): Promise<any> {
    // Mock data - in production, this would fetch historical risk data
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate mock risk data
      const baseRisk = 65;
      const variation = Math.sin(i / 7) * 10 + Math.random() * 5;
      const riskScore = Math.max(0, Math.min(100, baseRisk + variation));

      data.push({
        date: date.toISOString().split('T')[0],
        riskScore: Math.round(riskScore),
        volatility: Math.round(15 + Math.random() * 5),
        var95: Math.round(50000 + Math.random() * 20000),
      });
    }

    return data;
  }
}

// Made with Bob