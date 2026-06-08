// Impact Preview Modal Component
// Step 2: Shows estimated impact before running full simulation

import React, { useEffect, useState } from 'react';
import { Modal, LoadingSpinner, Badge } from '@/components/common';
import { ImpactPreview, SectorPreview } from '@/types/simulation-flow.types';

interface ImpactPreviewModalProps {
  isOpen: boolean;
  scenarioId: string;
  onClose: () => void;
  onProceed: (preview: ImpactPreview) => void;
  onBack: () => void;
}

const ImpactPreviewModal: React.FC<ImpactPreviewModalProps> = ({
  isOpen,
  scenarioId,
  onClose,
  onProceed,
  onBack,
}) => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [preview, setPreview] = useState<ImpactPreview | null>(null);

  useEffect(() => {
    if (isOpen && scenarioId) {
      calculatePreview();
    }
  }, [isOpen, scenarioId]);

  const calculatePreview = async () => {
    setIsCalculating(true);

    // Simulate preview calculation API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock preview data
    const previewData: ImpactPreview = {
      estimatedLoss: -25,
      riskLevel: 'high',
      recoveryTime: 4,
      confidence: 82,
      affectedSectors: [
        {
          name: 'Banking',
          riskLevel: 'critical',
          estimatedImpact: -35,
          icon: '🏦',
          color: 'red',
        },
        {
          name: 'Energy',
          riskLevel: 'high',
          estimatedImpact: -28,
          icon: '⚡',
          color: 'orange',
        },
        {
          name: 'Technology',
          riskLevel: 'medium',
          estimatedImpact: -15,
          icon: '💻',
          color: 'yellow',
        },
        {
          name: 'Healthcare',
          riskLevel: 'low',
          estimatedImpact: -5,
          icon: '🏥',
          color: 'green',
        },
      ],
      portfolioValue: {
        before: 2450000,
        after: 1837500,
      },
    };

    setPreview(previewData);
    setIsCalculating(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Impact Preview" size="xl">
      <div className="space-y-6">
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Calculating estimated impact...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Running quick analysis without full Monte Carlo simulation
            </p>
          </div>
        ) : preview ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">Expected Loss</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {preview.estimatedLoss}%
                </p>
              </div>

              <div className={`border-2 rounded-lg p-4 ${getRiskColor(preview.riskLevel)}`}>
                <p className="text-sm mb-1">Banking Risk</p>
                <p className="text-3xl font-bold uppercase">{preview.riskLevel}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Recovery Time</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {preview.recoveryTime}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500">Months</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Confidence</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {preview.confidence}%
                </p>
              </div>
            </div>

            {/* Portfolio Value Impact */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Portfolio Value Impact
              </h3>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Before:</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(preview.portfolioValue.before)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">After:</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(preview.portfolioValue.after)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Loss:</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(preview.portfolioValue.before - preview.portfolioValue.after)}
                  </p>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="mt-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-1000"
                    style={{
                      width: `${100 + preview.estimatedLoss}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Affected Sectors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Affected Sectors
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {preview.affectedSectors.map((sector) => (
                  <div
                    key={sector.name}
                    className={`
                      flex items-center justify-between p-4 rounded-lg border-2
                      ${getRiskColor(sector.riskLevel)}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{sector.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{sector.name}</p>
                        <p className="text-sm">{sector.estimatedImpact}% impact</p>
                      </div>
                    </div>
                    <span className="text-2xl">{getRiskIcon(sector.riskLevel)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                    Preview Estimate
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    This is a quick estimate. The full simulation with AI agent analysis will
                    provide more accurate results with confidence intervals and detailed
                    recommendations.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>←</span>
            Back to Validation
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => preview && onProceed(preview)}
              disabled={isCalculating || !preview}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🤖</span>
              Start Agent Analysis
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImpactPreviewModal;

// Made with Bob
