// AI Recommendations Page Component - Multi-Agent Collaboration

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Modal, ModalFooter } from '@/components/common';

interface AgentRecommendation {
  id: string;
  agent: string;
  agentIcon: string;
  agentColor: string;
  priority: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  action: string;
  expectedImpact: string;
  confidence: number;
  reasoning: string[];
}

const Recommendations: React.FC = () => {
  const [selectedRec, setSelectedRec] = useState<AgentRecommendation | null>(null);
  const [appliedRecs, setAppliedRecs] = useState<Set<string>>(new Set());

  const recommendations: AgentRecommendation[] = [
    {
      id: '1',
      agent: 'Risk Agent',
      agentIcon: '🔍',
      agentColor: 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700',
      priority: 'HIGH',
      title: 'Banking exposure too high (35%)',
      description:
        'Current banking sector allocation exceeds optimal range for risk-adjusted returns',
      action: 'Reduce banking exposure to 25%',
      expectedImpact: 'Risk Reduction: -8 points',
      confidence: 87,
      reasoning: [
        'Banking sector correlation with portfolio: 0.85 (very high)',
        'Sector volatility increased 15% in last quarter',
        'Concentration risk exceeds 30% threshold',
        'Historical data shows optimal range: 20-25%',
      ],
    },
    {
      id: '2',
      agent: 'Recommendation Agent',
      agentIcon: '💡',
      agentColor: 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
      priority: 'MEDIUM',
      title: 'Shift 12% to bonds',
      description: 'Increase fixed income allocation to improve portfolio stability',
      action: 'Rebalance: +12% bonds, -7% stocks, -5% ETFs',
      expectedImpact: 'Risk Reduction: -5 points, Stability: +8%',
      confidence: 82,
      reasoning: [
        'Current bond allocation (25%) below optimal (35-40%)',
        'Interest rate environment favorable for bonds',
        'Portfolio Sharpe ratio would improve from 1.2 to 1.4',
        'Reduces overall portfolio volatility by 12%',
      ],
    },
    {
      id: '3',
      agent: 'Market Agent',
      agentIcon: '📈',
      agentColor: 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700',
      priority: 'MEDIUM',
      title: 'Inflation trend increasing',
      description: 'Market indicators suggest rising inflation pressure',
      action: 'Hedge with commodities and inflation-protected securities',
      expectedImpact: 'Inflation Protection: +15%',
      confidence: 78,
      reasoning: [
        'CPI trending upward: +0.4% monthly average',
        'Commodity prices rising across energy and metals',
        'Fed policy signals potential rate adjustments',
        'Historical correlation: inflation hedges outperform in current conditions',
      ],
    },
    {
      id: '4',
      agent: 'Portfolio Agent',
      agentIcon: '🎯',
      agentColor: 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700',
      priority: 'INFO',
      title: 'Expected loss reduced by 5%',
      description: 'Recent rebalancing has improved portfolio resilience',
      action: 'Continue monitoring current allocation',
      expectedImpact: 'Maintained Improvement',
      confidence: 91,
      reasoning: [
        'Diversification score improved from 0.65 to 0.78',
        'Risk-adjusted returns up 3.2%',
        'Portfolio beta reduced from 1.15 to 1.08',
        'Stress test results show 15% better performance',
      ],
    },
    {
      id: '5',
      agent: 'Risk Agent',
      agentIcon: '🔍',
      agentColor: 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700',
      priority: 'HIGH',
      title: 'Tech sector concentration risk',
      description: 'Technology holdings represent 28% of equity allocation',
      action: 'Diversify into defensive sectors (utilities, consumer staples)',
      expectedImpact: 'Risk Reduction: -6 points',
      confidence: 85,
      reasoning: [
        'Tech sector P/E ratios at historical highs',
        'Increased regulatory scrutiny on major tech companies',
        'Sector correlation with market volatility: 0.92',
        'Defensive sectors show negative correlation: -0.35',
      ],
    },
    {
      id: '6',
      agent: 'Market Agent',
      agentIcon: '📈',
      agentColor: 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700',
      priority: 'MEDIUM',
      title: 'Emerging markets opportunity',
      description: 'Valuation gap between developed and emerging markets widening',
      action: 'Allocate 5-8% to emerging market ETFs',
      expectedImpact: 'Return Potential: +4-6% annually',
      confidence: 73,
      reasoning: [
        'EM valuations 35% below historical average',
        'Currency headwinds subsiding',
        'GDP growth forecasts: EM 5.2% vs DM 2.1%',
        'Diversification benefit: low correlation with current holdings',
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'INFO':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleApply = (recId: string) => {
    setAppliedRecs(new Set([...appliedRecs, recId]));
    setSelectedRec(null);
  };

  const handleDismiss = (recId: string) => {
    setAppliedRecs(new Set([...appliedRecs, recId]));
    setSelectedRec(null);
  };

  const activeRecommendations = recommendations.filter((rec) => !appliedRecs.has(rec.id));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Recommendation Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Multi-agent AI collaboration providing intelligent insights for your portfolio
        </p>
      </div>

      {/* Agent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-red-500">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔍</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Risk Agent</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Identifies portfolio risks and concentration issues
            </p>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💡</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Recommendation Agent</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suggests optimal portfolio adjustments
            </p>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📈</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Market Agent</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyzes market trends and opportunities
            </p>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Portfolio Agent</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitors overall portfolio health and performance
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Recommendations</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {activeRecommendations.length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applied Actions</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {appliedRecs.size}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Confidence</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(
                activeRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) /
                  activeRecommendations.length
              )}
              %
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {activeRecommendations.map((rec) => (
          <Card key={rec.id} className={`border-2 ${rec.agentColor}`}>
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl border-2 border-gray-200 dark:border-gray-700">
                    {rec.agentIcon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </h3>
                      <Badge variant={getPriorityColor(rec.priority)} size="sm">
                        {rec.priority}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{rec.agent}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-400">Action:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {rec.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-400">Impact:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {rec.expectedImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRec(rec)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApply(rec.id)}
                    className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {activeRecommendations.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You've reviewed all current recommendations. Check back later for new insights.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recommendation Detail Modal */}
      {selectedRec && (
        <Modal
          isOpen={!!selectedRec}
          onClose={() => setSelectedRec(null)}
          title={selectedRec.title}
          size="lg"
        >
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-3xl">{selectedRec.agentIcon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedRec.agent}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confidence: {selectedRec.confidence}%
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-700 dark:text-gray-300">{selectedRec.description}</p>
            </div>

            {/* Recommended Action */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Recommended Action
              </h4>
              <p className="text-gray-700 dark:text-gray-300">{selectedRec.action}</p>
            </div>

            {/* Expected Impact */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expected Impact</h4>
              <p className="text-green-600 dark:text-green-400 font-medium">
                {selectedRec.expectedImpact}
              </p>
            </div>

            {/* AI Reasoning */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">AI Reasoning</h4>
              <div className="space-y-2">
                {selectedRec.reasoning.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{index + 1}.</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ModalFooter>
            <button
              onClick={() => handleDismiss(selectedRec.id)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => handleApply(selectedRec.id)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Apply Recommendation
            </button>
          </ModalFooter>
        </Modal>
      )}

      {/* Multi-Agent Collaboration Info */}
      <Card className="border-2 border-primary-500">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🤖 How Multi-Agent AI Works
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Collaborative Intelligence
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our AI agents work together, each specializing in different aspects of portfolio
                management. They share insights and validate each other's recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Real-time market data analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Risk assessment and mitigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Portfolio optimization strategies</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Confidence Scoring
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Each recommendation includes a confidence score based on historical data, market
                conditions, and cross-validation between agents.
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">90-100%</span>
                    <span className="text-green-600">Very High Confidence</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">70-89%</span>
                    <span className="text-blue-600">High Confidence</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">50-69%</span>
                    <span className="text-yellow-600">Moderate Confidence</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Recommendations;

// Made with Bob
