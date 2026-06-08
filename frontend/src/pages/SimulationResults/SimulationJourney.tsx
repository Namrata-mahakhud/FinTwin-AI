// AI-Powered Simulation Journey Component
// Complete simulation experience with multi-agent collaboration

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, LoadingSpinner } from '@/components/common';
import {
  SimulationProcessingOverlay,
  MarketShockTimeline,
  AIAgentDiscussionPanel,
  RecoverySimulator,
} from '@/components/simulation';
import { useSimulation, useSimulationResults } from '@/hooks/useSimulations';

type SimulationStage = 
  | 'processing'
  | 'timeline'
  | 'impact'
  | 'agents'
  | 'recovery'
  | 'complete';

const SimulationJourney: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: simulation, isLoading: simLoading } = useSimulation(id!);
  const { data: results, isLoading: resultsLoading } = useSimulationResults(id!);

  const [currentStage, setCurrentStage] = useState<SimulationStage>('processing');
  const [showProcessing, setShowProcessing] = useState(true);

  // Mock data for timeline events
  const timelineEvents = [
    {
      day: 1,
      title: 'Inflation Increase +3%',
      description: 'Central bank reports unexpected inflation surge affecting consumer prices',
      icon: '💰',
      impact: -3.2,
      riskScore: 52,
      type: 'shock' as const,
    },
    {
      day: 5,
      title: 'Banking Sector -8%',
      description: 'Major banks report lower earnings due to increased loan defaults',
      icon: '🏦',
      impact: -8.1,
      riskScore: 65,
      type: 'shock' as const,
    },
    {
      day: 10,
      title: 'Currency Depreciation -12%',
      description: 'Local currency weakens against major trading partners',
      icon: '💱',
      impact: -12.3,
      riskScore: 78,
      type: 'impact' as const,
    },
    {
      day: 15,
      title: 'Portfolio Value Falls',
      description: 'Combined market pressures reduce overall portfolio valuation',
      icon: '📉',
      impact: -18.5,
      riskScore: 82,
      type: 'impact' as const,
    },
    {
      day: 20,
      title: 'Risk Score Peaks at 82',
      description: 'Maximum risk exposure reached, defensive measures recommended',
      icon: '⚠️',
      impact: -22.0,
      riskScore: 82,
      type: 'impact' as const,
    },
    {
      day: 30,
      title: 'Recovery Simulation Begins',
      description: 'AI agents propose strategic recovery plan',
      icon: '🔄',
      impact: -14.2,
      riskScore: 61,
      type: 'recovery' as const,
    },
  ];

  // Mock agent messages
  const agentMessages = [
    {
      agent: 'Market Agent',
      agentType: 'market' as const,
      message: 'Oil price spike detected. Energy sector costs increasing by 15%. This will cascade through transportation and manufacturing.',
      icon: '📊',
      timestamp: Date.now(),
      confidence: 92,
      data: { oil_price_change: '+15%', affected_sectors: 3 },
    },
    {
      agent: 'Risk Agent',
      agentType: 'risk' as const,
      message: 'Banking exposure exceeds safe threshold at 35%. Current market conditions suggest reducing to 25% or below.',
      icon: '⚠️',
      timestamp: Date.now() + 1000,
      confidence: 88,
      data: { current_exposure: '35%', recommended: '25%', risk_level: 'High' },
    },
    {
      agent: 'Portfolio Agent',
      agentType: 'portfolio' as const,
      message: 'Expected portfolio loss: 25% over 30-day period. High correlation between banking and energy sectors amplifying impact.',
      icon: '💼',
      timestamp: Date.now() + 2000,
      confidence: 85,
      data: { expected_loss: '-25%', correlation: 0.85 },
    },
    {
      agent: 'Recommendation Agent',
      agentType: 'recommendation' as const,
      message: 'Immediate action required: Move 10% of assets to government bonds. Reduce banking sector allocation by 10%. Add defensive stocks.',
      icon: '🎯',
      timestamp: Date.now() + 3000,
      confidence: 90,
      data: { priority: 'Critical', actions: 3, expected_improvement: '+11%' },
    },
    {
      agent: 'Reporting Agent',
      agentType: 'reporting' as const,
      message: 'Generating comprehensive crisis report with recovery strategies. Report includes stress test results and Monte Carlo projections.',
      icon: '📋',
      timestamp: Date.now() + 4000,
      confidence: 95,
      data: { report_sections: 5, charts: 8 },
    },
  ];

  // Portfolio impact data
  const portfolioImpact = {
    before: {
      value: 2450000,
      loss: -25,
      risk: 84,
    },
    after: {
      value: 2107000,
      loss: -14,
      risk: 61,
    },
  };

  useEffect(() => {
    if (showProcessing) {
      // Simulate processing completion
      const timer = setTimeout(() => {
        setShowProcessing(false);
        setCurrentStage('timeline');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showProcessing]);

  const handleProcessingComplete = () => {
    setShowProcessing(false);
    setCurrentStage('timeline');
  };

  const handleRecoverySimulation = async (strategies: string[]) => {
    // Simulate recovery calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const improvement = strategies.length * 3.5;
    const riskReduction = strategies.length * 4;
    
    return {
      beforeLoss: -25,
      beforeRisk: 84,
      afterLoss: Math.max(-25 + improvement, -5),
      afterRisk: Math.max(84 - riskReduction, 40),
      recoveryTime: Math.max(6 - strategies.length, 2),
      confidence: Math.min(75 + strategies.length * 3, 95),
    };
  };

  if (simLoading || resultsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading simulation..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Processing Overlay */}
      <SimulationProcessingOverlay
        isVisible={showProcessing}
        onComplete={handleProcessingComplete}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Financial Crisis Command Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Multi-agent simulation with agentic collaboration
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Stage Progress */}
      {!showProcessing && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              {['Timeline', 'Impact', 'AI Agents', 'Recovery', 'Complete'].map((stage, index) => (
                <div key={stage} className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${index <= ['timeline', 'impact', 'agents', 'recovery', 'complete'].indexOf(currentStage)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage}
                  </span>
                  {index < 4 && (
                    <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Market Shock Timeline */}
      {!showProcessing && (
        <MarketShockTimeline events={timelineEvents} isAnimating={currentStage === 'timeline'} />
      )}

      {/* Live Impact Dashboard */}
      {!showProcessing && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Live Portfolio Impact Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Portfolio Value
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  ${portfolioImpact.before.value.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">↓</div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ${portfolioImpact.after.value.toLocaleString()}
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Loss Percentage
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {portfolioImpact.before.loss}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Expected over 30 days
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Risk Score
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {portfolioImpact.before.risk}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">↑</div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {portfolioImpact.before.risk}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* AI Agent Discussion Panel */}
      {!showProcessing && (
        <AIAgentDiscussionPanel
          messages={agentMessages}
          isActive={currentStage === 'agents'}
        />
      )}

      {/* Recovery Simulator */}
      {!showProcessing && (
        <RecoverySimulator
          initialLoss={portfolioImpact.before.loss}
          initialRisk={portfolioImpact.before.risk}
          onRunRecovery={handleRecoverySimulation}
        />
      )}

      {/* Final Report Button */}
      {!showProcessing && currentStage === 'complete' && (
        <Card className="border-2 border-green-500">
          <CardBody>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Simulation Complete
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                AI agents have analyzed the scenario and generated comprehensive recommendations
              </p>
              <button
                onClick={() => navigate(`/simulations/${id}`)}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                📊 View Full Report
              </button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SimulationJourney;

// Made with Bob