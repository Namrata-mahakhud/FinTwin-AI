// Case Closure Page
// Final summary and report for completed crisis case

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody } from '@/components/common';
import { useCaseStore } from '@/store/caseStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const CaseClosure: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { activeCase, cases, closeCase, archiveCase } = useCaseStore();
  const [isExporting, setIsExporting] = useState(false);

  // Get the case to close (from params or active case)
  const caseToClose = id ? cases.find((c) => c.caseId === id) : activeCase;

  if (!caseToClose) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Case Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The requested case could not be found.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Return to Mission Control
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const riskReduction = caseToClose.initialRisk - caseToClose.currentRisk;
  const riskReductionPercent = ((riskReduction / caseToClose.initialRisk) * 100).toFixed(1);
  const lossRecoveryPercent =
    caseToClose.initialLoss !== 0
      ? ((caseToClose.recoveredLoss / Math.abs(caseToClose.initialLoss)) * 100).toFixed(1)
      : '0';

  // Recovery timeline data
  const timelineData = [
    { stage: 'Initial', risk: caseToClose.initialRisk, loss: Math.abs(caseToClose.initialLoss) },
    {
      stage: 'Analysis',
      risk: caseToClose.initialRisk - 3,
      loss: Math.abs(caseToClose.initialLoss) - 2,
    },
    {
      stage: 'Recovery',
      risk: caseToClose.initialRisk - 5,
      loss: Math.abs(caseToClose.initialLoss) - 4,
    },
    {
      stage: 'Final',
      risk: caseToClose.currentRisk,
      loss: Math.abs(caseToClose.initialLoss) - caseToClose.recoveredLoss,
    },
  ];

  // Actions applied data
  const actionsData = [
    { action: 'Rebalance', impact: 35 },
    { action: 'Hedge', impact: 25 },
    { action: 'Diversify', impact: 20 },
    { action: 'Reduce Exposure', impact: 20 },
  ];

  const handleExportReport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert('Report exported successfully! (Demo mode)');
    }, 2000);
  };

  const handleReplaySimulation = () => {
    navigate(`/scenarios/${caseToClose.scenario.id}`);
  };

  const handleArchiveCase = () => {
    if (confirm('Are you sure you want to archive this case?')) {
      archiveCase(caseToClose.caseId);
      navigate('/dashboard');
    }
  };

  const handleNewCase = () => {
    navigate('/scenarios/new');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <div className="text-6xl">✅</div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Crisis Case Closed
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{caseToClose.caseName}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Risk Reduction</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {riskReduction} pts
              </p>
              <p className="text-xs text-gray-500">
                {caseToClose.initialRisk} → {caseToClose.currentRisk}
              </p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                {riskReductionPercent}% improvement
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Loss Recovery</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {caseToClose.recoveredLoss.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                of {Math.abs(caseToClose.initialLoss).toFixed(1)}% loss
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                {lossRecoveryPercent}% recovered
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recovery Progress</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {caseToClose.recoveryProgress}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${caseToClose.recoveryProgress}%` }}
                />
              </div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-2">
                Target achieved
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Actions Applied</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {caseToClose.recommendations.length}
              </p>
              <p className="text-xs text-gray-500">recommendations</p>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-2">
                All implemented
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recovery Timeline */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Recovery Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="stage" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#EF4444"
                strokeWidth={2}
                name="Risk Score"
                dot={{ fill: '#EF4444', r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Loss %"
                dot={{ fill: '#3B82F6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Data Source: Crisis Simulation Engine • Model Confidence: 87%
          </div>
        </CardBody>
      </Card>

      {/* Actions Impact */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💊 Recovery Actions Impact
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={actionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="action" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="impact" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Recommendations Applied */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✅ Recommendations Applied
          </h3>
          <div className="space-y-3">
            {caseToClose.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="text-2xl">✓</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{rec}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: Applied • Impact: Positive
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  APPLIED
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Final Agent Summary */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🤖 AI Agent Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 dark:text-white">Market Agent</p>
                <span className="text-sm text-blue-600 dark:text-blue-400">Confidence: 89%</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Identified banking sector vulnerability and recommended immediate rebalancing.
                Market correlation analysis confirmed high systemic risk.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 dark:text-white">Risk Agent</p>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Confidence: 92%
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Portfolio risk reduced from critical to moderate levels through strategic
                diversification and hedging strategies.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 dark:text-white">Recovery Agent</p>
                <span className="text-sm text-green-600 dark:text-green-400">Confidence: 85%</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Recovery recommendations successfully implemented. Portfolio resilience improved by
                35% with optimized asset allocation.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📄 Final Report Preview
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Executive Summary
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Crisis case "{caseToClose.caseName}" successfully managed and closed. Initial risk
                of {caseToClose.initialRisk}/100 reduced to {caseToClose.currentRisk}/100 through
                systematic application of {caseToClose.recommendations.length} recovery
                recommendations. Portfolio loss of {Math.abs(caseToClose.initialLoss).toFixed(1)}%
                partially recovered with {caseToClose.recoveredLoss.toFixed(1)}% improvement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Metrics</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  • Scenario: {caseToClose.scenario.name} ({caseToClose.scenario.severity})
                </li>
                <li>
                  • Portfolio: {caseToClose.portfolio.name} ($
                  {(caseToClose.portfolio.value / 1000000).toFixed(2)}M)
                </li>
                <li>
                  • Risk Reduction: {riskReduction} points ({riskReductionPercent}%)
                </li>
                <li>• Recovery Progress: {caseToClose.recoveryProgress}%</li>
                <li>
                  • Case Duration:{' '}
                  {Math.floor(
                    (new Date(caseToClose.updatedAt).getTime() -
                      new Date(caseToClose.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleExportReport}
          disabled={isExporting}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <span className="animate-spin inline-block mr-2">⚙️</span>
              Exporting...
            </>
          ) : (
            <>📥 Export Full Report</>
          )}
        </button>
        <button
          onClick={handleReplaySimulation}
          className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          🔄 Replay Simulation
        </button>
        <button
          onClick={handleArchiveCase}
          className="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          📦 Archive Case
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleNewCase}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl text-lg"
        >
          🚀 Start New Crisis Simulation
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          ⚠️ <strong>Disclaimer:</strong> This report is generated for risk planning purposes only
          and does not constitute financial advice. All simulations are based on historical data and
          statistical models with inherent uncertainties. Consult with qualified financial advisors
          before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default CaseClosure;

// Made with Bob
