// Scenario Compare Page
// Side-by-side comparison of crisis scenarios and outcomes

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/common';
import { useCaseStore } from '@/store/caseStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ScenarioCompare: React.FC = () => {
  const navigate = useNavigate();
  const { cases } = useCaseStore();
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  // Get closed cases for comparison
  const closedCases = cases.filter(c => c.status === 'closed');

  const toggleCaseSelection = (caseId: string) => {
    if (selectedCases.includes(caseId)) {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    } else if (selectedCases.length < 3) {
      setSelectedCases([...selectedCases, caseId]);
    }
  };

  const selectedCaseData = selectedCases
    .map(id => cases.find(c => c.caseId === id))
    .filter(Boolean);

  // Prepare comparison data for charts
  const riskComparisonData = selectedCaseData.map(c => ({
    name: c!.caseName.substring(0, 15) + '...',
    initial: c!.initialRisk,
    final: c!.currentRisk,
  }));

  const lossComparisonData = selectedCaseData.map(c => ({
    name: c!.caseName.substring(0, 15) + '...',
    initial: Math.abs(c!.initialLoss),
    recovered: c!.recoveredLoss,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRecoveryTime = (caseItem: any) => {
    const start = new Date(caseItem.createdAt);
    const end = new Date(caseItem.updatedAt);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Scenario Compare
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare crisis scenarios and recovery outcomes
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
        >
          ← Back to Mission Control
        </button>
      </div>

      {/* Selection Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                Select 2-3 cases to compare
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {selectedCases.length} of 3 selected
              </p>
            </div>
          </div>
          {selectedCases.length > 0 && (
            <button
              onClick={() => setSelectedCases([])}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Case Selection Grid */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Cases to Compare
          </h3>
          {closedCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  onClick={() => toggleCaseSelection(caseItem.caseId)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCases.includes(caseItem.caseId)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {caseItem.caseName}
                    </h4>
                    {selectedCases.includes(caseItem.caseId) && (
                      <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {caseItem.scenario.name}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Risk: {caseItem.currentRisk}/100</span>
                    <span className="text-green-600 dark:text-green-400">
                      {caseItem.recoveryProgress}% recovered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No closed cases available for comparison. Complete a crisis simulation first.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Comparison Results */}
      {selectedCaseData.length >= 2 && (
        <>
          {/* Comparison Table */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detailed Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Metric
                      </th>
                      {selectedCaseData.map((caseItem) => (
                        <th
                          key={caseItem!.caseId}
                          className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white"
                        >
                          {caseItem!.caseName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Scenario</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-gray-900 dark:text-white">
                          {caseItem!.scenario.name}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Initial Loss</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-red-600 dark:text-red-400 font-semibold">
                          {caseItem!.initialLoss.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Recovered Loss</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">
                          {caseItem!.recoveredLoss.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Initial Risk</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-gray-900 dark:text-white">
                          {caseItem!.initialRisk}/100
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Final Risk</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-gray-900 dark:text-white">
                          {caseItem!.currentRisk}/100
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Recovery Time</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-gray-900 dark:text-white">
                          {getRecoveryTime(caseItem)} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Actions Applied</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4 text-gray-900 dark:text-white">
                          {caseItem!.recommendations.length}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Recovery Progress</td>
                      {selectedCaseData.map((caseItem) => (
                        <td key={caseItem!.caseId} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {caseItem!.recoveryProgress}%
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${caseItem!.recoveryProgress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* Risk Comparison Chart */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Risk Score Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="initial" fill="#EF4444" name="Initial Risk" />
                  <Bar dataKey="final" fill="#10B981" name="Final Risk" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Lower values indicate better risk management
              </div>
            </CardBody>
          </Card>

          {/* Loss Recovery Chart */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Loss Recovery Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lossComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="initial" fill="#F59E0B" name="Initial Loss %" />
                  <Bar dataKey="recovered" fill="#3B82F6" name="Recovered %" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Higher recovery values indicate better outcomes
              </div>
            </CardBody>
          </Card>

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={() => alert('Comparison report exported! (Demo mode)')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              📥 Export Comparison Report
            </button>
          </div>
        </>
      )}

      {/* Data Source */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Data Source:</strong> Crisis Simulation Engine • <strong>Model Confidence:</strong> 85-92% • 
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          ⚠️ <strong>Disclaimer:</strong> Comparison results are based on simulation models and historical data. 
          Actual outcomes may vary. This analysis is for risk planning purposes only and does not constitute financial advice.
        </p>
      </div>
    </div>
  );
};

export default ScenarioCompare;

// Made with Bob