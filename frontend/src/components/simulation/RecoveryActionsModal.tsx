// Recovery Actions Modal Component
// Step 5: Allows users to apply recovery strategies

import React, { useState } from 'react';
import { Modal, Badge } from '@/components/common';
import { RecoveryAction, RecoveryResult } from '@/types/simulation-flow.types';

interface RecoveryActionsModalProps {
  isOpen: boolean;
  simulationId: string;
  currentRisk: number;
  currentLoss: number;
  onClose: () => void;
  onApply: (result: RecoveryResult) => void;
  onSkip: () => void;
}

const RecoveryActionsModal: React.FC<RecoveryActionsModalProps> = ({
  isOpen,
  simulationId,
  currentRisk,
  currentLoss,
  onClose,
  onApply,
  onSkip,
}) => {
  const [actions, setActions] = useState<RecoveryAction[]>([
    {
      id: 'reduce-banking',
      title: 'Reduce Banking Exposure',
      description: 'Shift 10% from banking sector to bonds',
      type: 'reduce_exposure',
      estimatedImpact: {
        riskReduction: 15,
        lossReduction: 8,
      },
      selected: false,
      priority: 'high',
    },
    {
      id: 'increase-bonds',
      title: 'Increase Bond Allocation',
      description: 'Move 15% of portfolio to government bonds',
      type: 'diversify',
      estimatedImpact: {
        riskReduction: 12,
        lossReduction: 6,
      },
      selected: false,
      priority: 'high',
    },
    {
      id: 'add-gold',
      title: 'Add Gold Hedge',
      description: 'Allocate 5% to gold as safe haven',
      type: 'hedge',
      estimatedImpact: {
        riskReduction: 8,
        lossReduction: 4,
      },
      selected: false,
      priority: 'medium',
    },
    {
      id: 'currency-hedge',
      title: 'Currency Risk Hedge',
      description: 'Implement currency hedging strategy',
      type: 'hedge',
      estimatedImpact: {
        riskReduction: 10,
        lossReduction: 5,
      },
      selected: false,
      priority: 'medium',
    },
    {
      id: 'rebalance',
      title: 'Portfolio Rebalancing',
      description: 'Rebalance to target allocation ratios',
      type: 'rebalance',
      estimatedImpact: {
        riskReduction: 6,
        lossReduction: 3,
      },
      selected: false,
      priority: 'low',
    },
  ]);

  const [isApplying, setIsApplying] = useState(false);

  const toggleAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId ? { ...action, selected: !action.selected } : action
      )
    );
  };

  const calculateNewMetrics = () => {
    const selectedActions = actions.filter((a) => a.selected);
    const totalRiskReduction = selectedActions.reduce(
      (sum, a) => sum + a.estimatedImpact.riskReduction,
      0
    );
    const totalLossReduction = selectedActions.reduce(
      (sum, a) => sum + a.estimatedImpact.lossReduction,
      0
    );

    return {
      newRisk: Math.max(0, currentRisk - totalRiskReduction),
      newLoss: Math.max(0, Math.abs(currentLoss) - totalLossReduction),
      riskReduction: totalRiskReduction,
      lossReduction: totalLossReduction,
    };
  };

  const handleApply = async () => {
    setIsApplying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedActions = actions.filter((a) => a.selected);
    const metrics = calculateNewMetrics();

    const result: RecoveryResult = {
      originalRisk: currentRisk,
      newRisk: metrics.newRisk,
      originalLoss: currentLoss,
      newLoss: -metrics.newLoss,
      appliedActions: selectedActions,
      timestamp: new Date(),
    };

    setIsApplying(false);
    onApply(result);
  };

  const metrics = calculateNewMetrics();
  const hasSelectedActions = actions.some((a) => a.selected);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: RecoveryAction['type']) => {
    switch (type) {
      case 'reduce_exposure':
        return '📉';
      case 'diversify':
        return '🎯';
      case 'hedge':
        return '🛡️';
      case 'rebalance':
        return '⚖️';
      default:
        return '📊';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recovery Actions" size="xl">
      <div className="space-y-6">
        {/* Current Status */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-3">
            Current Portfolio Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-red-700 dark:text-red-400 mb-1">Risk Score:</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currentRisk}</p>
            </div>
            <div>
              <p className="text-sm text-red-700 dark:text-red-400 mb-1">Portfolio Loss:</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currentLoss}%</p>
            </div>
          </div>
        </div>

        {/* Recovery Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Select Recovery Actions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose one or more actions to reduce risk and minimize losses
          </p>

          <div className="space-y-3">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${
                    action.selected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center
                        ${
                          action.selected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }
                      `}
                    >
                      {action.selected && <span className="text-white text-sm">✓</span>}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTypeIcon(action.type)}</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </h4>
                      </div>
                      <Badge variant={getPriorityColor(action.priority)} size="sm">
                        {action.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {action.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 dark:text-green-400">↓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Risk: -{action.estimatedImpact.riskReduction}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 dark:text-green-400">↓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Loss: -{action.estimatedImpact.lossReduction}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Projected Impact */}
        {hasSelectedActions && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3">
              Projected Impact
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 mb-2">Risk Score:</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {currentRisk}
                  </span>
                  <span className="text-green-600 dark:text-green-400">→</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {metrics.newRisk}
                  </span>
                  <span className="text-sm text-green-700 dark:text-green-400">
                    (-{metrics.riskReduction})
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-green-700 dark:text-green-400 mb-2">Portfolio Loss:</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {currentLoss}%
                  </span>
                  <span className="text-green-600 dark:text-green-400">→</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    -{metrics.newLoss}%
                  </span>
                  <span className="text-sm text-green-700 dark:text-green-400">
                    (+{metrics.lossReduction}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Recovery Strategy</p>
              <p className="text-blue-700 dark:text-blue-400">
                These actions are AI-recommended based on your scenario analysis. You can select
                multiple actions for cumulative effect.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onSkip}
            disabled={isApplying}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Skip Recovery
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isApplying}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!hasSelectedActions || isApplying}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Applying...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Apply Recovery ({actions.filter((a) => a.selected).length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecoveryActionsModal;

// Made with Bob
