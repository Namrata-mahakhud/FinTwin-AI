// Case Library Page
// Historical crisis scenarios and templates

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/common';
import { SEED_CASE_LIBRARY, SEED_PORTFOLIOS } from '@/data/seedData';
import { useCaseStore } from '@/store/caseStore';

const CaseLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { createCase } = useCaseStore();
  const [selectedType, setSelectedType] = useState<'all' | 'historical' | 'template'>('all');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<string | null>(null);

  const filteredCases = selectedType === 'all' 
    ? SEED_CASE_LIBRARY 
    : SEED_CASE_LIBRARY.filter(c => c.type === selectedType);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-500';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 border-gray-500';
    }
  };

  const handleLoadCase = (caseId: string) => {
    const caseItem = SEED_CASE_LIBRARY.find(c => c.id === caseId);
    if (caseItem) {
      // Create a new case based on the library item
      const defaultPortfolio = SEED_PORTFOLIOS[1]; // Balanced Portfolio
      createCase(
        `${caseItem.name} - ${new Date().toLocaleDateString()}`,
        caseId,
        caseItem.name,
        defaultPortfolio.id
      );
      navigate('/scenarios/new');
    }
  };

  const handleRunAgainstPortfolio = (caseId: string) => {
    setSelectedCase(caseId);
    // In a real app, this would open a portfolio selection modal
    alert('Portfolio selection modal would open here. (Demo mode)');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📚 Case Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historical crisis scenarios and simulation templates
          </p>
        </div>
        <button
          onClick={() => navigate('/scenarios/new')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          ➕ Create Custom Scenario
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Cases ({SEED_CASE_LIBRARY.length})
        </button>
        <button
          onClick={() => setSelectedType('historical')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedType === 'historical'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Historical ({SEED_CASE_LIBRARY.filter(c => c.type === 'historical').length})
        </button>
        <button
          onClick={() => setSelectedType('template')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedType === 'template'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Templates ({SEED_CASE_LIBRARY.filter(c => c.type === 'template').length})
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>About Case Library:</strong> Historical cases are based on real market events with documented outcomes. 
              Templates are configurable scenarios for stress testing. All cases can be customized before running simulations.
            </p>
          </div>
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <Card key={caseItem.id}>
            <CardBody>
              <div className="space-y-4">
                {/* Case Header */}
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{caseItem.icon}</div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(caseItem.severity)}`}>
                      {caseItem.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {caseItem.type === 'historical' ? '📜 Historical' : '📋 Template'}
                    </span>
                  </div>
                </div>

                {/* Case Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {caseItem.name}
                  </h3>
                  {caseItem.year && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Year: {caseItem.year}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {caseItem.description}
                  </p>
                </div>

                {/* Impact Metric */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Impact</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {caseItem.estimatedImpact.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Portfolio loss projection
                  </p>
                </div>

                {/* Assumptions Toggle */}
                <button
                  onClick={() => setShowAssumptions(showAssumptions === caseItem.id ? null : caseItem.id)}
                  className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showAssumptions === caseItem.id ? '▼ Hide' : '▶'} View Assumptions
                </button>

                {/* Assumptions List */}
                {showAssumptions === caseItem.id && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                      Key Assumptions:
                    </p>
                    {caseItem.assumptions.map((assumption, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">•</span>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{assumption}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleLoadCase(caseItem.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Load Case
                  </button>
                  <button
                    onClick={() => handleRunAgainstPortfolio(caseItem.id)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Run vs Portfolio
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Cases Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No cases match the selected filter.
              </p>
              <button
                onClick={() => setSelectedType('all')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                View All Cases
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Cases</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {SEED_CASE_LIBRARY.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Available scenarios</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Historical Events</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {SEED_CASE_LIBRARY.filter(c => c.type === 'historical').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Real market crises</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Impact</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {(SEED_CASE_LIBRARY.reduce((sum, c) => sum + Math.abs(c.estimatedImpact), 0) / SEED_CASE_LIBRARY.length).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Portfolio loss</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Data Sources:</strong> Federal Reserve Economic Data (FRED), Bloomberg Terminal, 
          Historical Market Analysis • <strong>Last Updated:</strong> January 2024 • 
          <strong>Model Confidence:</strong> 85-92% depending on scenario
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          ⚠️ <strong>Disclaimer:</strong> Historical scenarios are based on past events and may not predict future outcomes. 
          All simulations are for risk planning purposes only and do not constitute financial advice. 
          Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
};

export default CaseLibrary;

// Made with Bob