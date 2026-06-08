// Recovery Simulator Component
// Allows users to test recovery strategies and see impact

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, LoadingSpinner } from '@/components/common';

interface RecoveryStrategy {
  id: string;
  title: string;
  description: string;
  icon: string;
  expectedImpact: number;
  riskReduction: number;
  timeframe: string;
}

interface RecoveryResult {
  beforeLoss: number;
  beforeRisk: number;
  afterLoss: number;
  afterRisk: number;
  recoveryTime: number;
  confidence: number;
}

interface RecoverySimulatorProps {
  initialLoss: number;
  initialRisk: number;
  onRunRecovery: (strategies: string[]) => Promise<RecoveryResult>;
}

const RecoverySimulator: React.FC<RecoverySimulatorProps> = ({
  initialLoss,
  initialRisk,
  onRunRecovery,
}) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RecoveryResult | null>(null);

  const strategies: RecoveryStrategy[] = [
    {
      id: 'bonds',
      title: 'Move 10% to Bonds',
      description: 'Shift portfolio allocation to safer government bonds',
      icon: '📊',
      expectedImpact: 8,
      riskReduction: 15,
      timeframe: '2-3 months',
    },
    {
      id: 'banking',
      title: 'Reduce Banking Exposure',
      description: 'Decrease allocation in high-risk banking sector',
      icon: '🏦',
      expectedImpact: 12,
      riskReduction: 20,
      timeframe: '1-2 months',
    },
    {
      id: 'gold',
      title: 'Increase Gold Allocation',
      description: 'Add defensive precious metals to portfolio',
      icon: '🥇',
      expectedImpact: 6,
      riskReduction: 10,
      timeframe: '3-4 months',
    },
    {
      id: 'hedge',
      title: 'Hedge Currency Risk',
      description: 'Implement currency hedging strategies',
      icon: '💱',
      expectedImpact: 10,
      riskReduction: 18,
      timeframe: '1 month',
    },
    {
      id: 'diversify',
      title: 'Diversify Sectors',
      description: 'Spread investments across multiple sectors',
      icon: '🌐',
      expectedImpact: 7,
      riskReduction: 12,
      timeframe: '2-3 months',
    },
    {
      id: 'defensive',
      title: 'Add Defensive Stocks',
      description: 'Include utilities and consumer staples',
      icon: '🛡️',
      expectedImpact: 5,
      riskReduction: 8,
      timeframe: '1-2 months',
    },
  ];

  const toggleStrategy = (id: string) => {
    setSelectedStrategies(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunRecovery = async () => {
    if (selectedStrategies.length === 0) return;

    setIsRunning(true);
    try {
      const recoveryResult = await onRunRecovery(selectedStrategies);
      setResult(recoveryResult);
    } catch (error) {
      console.error('Recovery simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const calculateTotalImpact = () => {
    return selectedStrategies.reduce((total, id) => {
      const strategy = strategies.find(s => s.id === id);
      return total + (strategy?.expectedImpact || 0);
    }, 0);
  };

  const calculateTotalRiskReduction = () => {
    return selectedStrategies.reduce((total, id) => {
      const strategy = strategies.find(s => s.id === id);
      return total + (strategy?.riskReduction || 0);
    }, 0);
  };

  return (
    <Card className="border-2 border-green-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🔄</span>
              Recovery Strategy Simulator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select strategies to simulate portfolio recovery
            </p>
          </div>
          {selectedStrategies.length > 0 && (
            <Badge variant="success" size="lg">
              {selectedStrategies.length} Selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {/* Strategy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {strategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => toggleStrategy(strategy.id)}
              disabled={isRunning}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedStrategies.includes(strategy.id)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{strategy.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {strategy.title}
                    </h4>
                    {selectedStrategies.includes(strategy.id) && (
                      <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {strategy.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      +{strategy.expectedImpact}% recovery
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      -{strategy.riskReduction} risk
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {strategy.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Expected Impact Summary */}
        {selectedStrategies.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Expected Combined Impact:
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Loss Recovery
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{calculateTotalImpact().toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Risk Reduction
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  -{calculateTotalRiskReduction()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Run Recovery Button */}
        <button
          onClick={handleRunRecovery}
          disabled={selectedStrategies.length === 0 || isRunning}
          className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
        >
          {isRunning ? (
            <>
              <LoadingSpinner size="sm" />
              Running Recovery Simulation...
            </>
          ) : (
            <>
              <span>🚀</span>
              Run Recovery Strategy
            </>
          )}
        </button>

        {/* Recovery Results */}
        {result && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-lg p-6 border-2 border-green-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                Recovery Simulation Results
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Before Recovery */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    Before Recovery
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Loss
                      </div>
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {result.beforeLoss}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Risk Score
                      </div>
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {result.beforeRisk}
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Recovery */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    After Recovery
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Loss
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {result.afterLoss}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Risk Score
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {result.afterRisk}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Recovery Time
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.recoveryTime} months
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Confidence
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecoverySimulator;

// Made with Bob