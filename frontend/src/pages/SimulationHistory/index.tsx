// Simulation History Page Component
// Shows all past simulations with replay, compare, and export features

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Badge, LoadingSpinner, EmptyState } from '@/components/common';
import { SimulationHistoryItem } from '@/types/simulation-flow.types';

const SimulationHistory: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock simulation history data
  const [simulations] = useState<SimulationHistoryItem[]>([
    {
      id: 'sim_001',
      scenarioId: 'scn_001',
      scenarioName: 'Banking Crisis Q1',
      status: 'completed',
      createdAt: new Date('2024-01-15T10:30:00'),
      completedAt: new Date('2024-01-15T10:35:00'),
      results: {
        loss: -25,
        riskScore: 84,
        recoveryApplied: true,
        portfolioValue: {
          before: 2450000,
          after: 1837500,
        },
      },
      duration: 300,
    },
    {
      id: 'sim_002',
      scenarioId: 'scn_002',
      scenarioName: 'Inflation Shock',
      status: 'running',
      createdAt: new Date('2024-01-16T14:20:00'),
      results: {
        loss: -18,
        riskScore: 72,
        recoveryApplied: false,
        portfolioValue: {
          before: 2450000,
          after: 2009000,
        },
      },
    },
    {
      id: 'sim_003',
      scenarioId: 'scn_003',
      scenarioName: 'Oil Crisis',
      status: 'recovered',
      createdAt: new Date('2024-01-14T09:15:00'),
      completedAt: new Date('2024-01-14T09:20:00'),
      results: {
        loss: -15,
        riskScore: 61,
        recoveryApplied: true,
        portfolioValue: {
          before: 2450000,
          after: 2082500,
        },
      },
      duration: 280,
    },
    {
      id: 'sim_004',
      scenarioId: 'scn_004',
      scenarioName: 'Market Volatility',
      status: 'completed',
      createdAt: new Date('2024-01-13T16:45:00'),
      completedAt: new Date('2024-01-13T16:50:00'),
      results: {
        loss: -12,
        riskScore: 58,
        recoveryApplied: false,
        portfolioValue: {
          before: 2450000,
          after: 2156000,
        },
      },
      duration: 290,
    },
  ]);

  const getStatusBadge = (status: SimulationHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'running':
        return <Badge variant="info">Running</Badge>;
      case 'recovered':
        return <Badge variant="warning">Recovered</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: SimulationHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'running':
        return '⚙️';
      case 'recovered':
        return '🔄';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleReplay = (simulation: SimulationHistoryItem) => {
    navigate(`/scenarios/${simulation.scenarioId}/run`);
  };

  const handleCompare = () => {
    if (selectedItems.length >= 2) {
      navigate(`/simulations/compare?ids=${selectedItems.join(',')}`);
    }
  };

  const handleExport = (simulation: SimulationHistoryItem) => {
    // Mock export functionality
    const data = JSON.stringify(simulation, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation_${simulation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewResults = (simulation: SimulationHistoryItem) => {
    navigate(`/simulations/${simulation.id}/results`);
  };

  const filteredSimulations = simulations.filter(sim =>
    filterStatus === 'all' || sim.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading simulation history..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Simulation History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View, replay, and compare past simulations
          </p>
        </div>

        {selectedItems.length >= 2 && (
          <button
            onClick={handleCompare}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>📊</span>
            Compare Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by status:
            </span>
            <div className="flex gap-2">
              {['all', 'completed', 'running', 'recovered', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Simulations List */}
      {filteredSimulations.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No simulations found"
          description="No simulations match the selected filter"
        />
      ) : (
        <div className="space-y-4">
          {filteredSimulations.map((simulation) => (
            <Card key={simulation.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    <button
                      onClick={() => toggleSelection(simulation.id)}
                      className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                        ${selectedItems.includes(simulation.id)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                        }
                      `}
                    >
                      {selectedItems.includes(simulation.id) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </button>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                      {getStatusIcon(simulation.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {simulation.scenarioName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(simulation.createdAt)}
                          {simulation.duration && (
                            <span className="ml-2">
                              • Duration: {Math.round(simulation.duration / 60)}m {simulation.duration % 60}s
                            </span>
                          )}
                        </p>
                      </div>
                      {getStatusBadge(simulation.status)}
                    </div>

                    {/* Results Summary */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Loss</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {simulation.results.loss}%
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Risk Score</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {simulation.results.riskScore}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Before</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(simulation.results.portfolioValue.before)}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">After</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(simulation.results.portfolioValue.after)}
                        </p>
                      </div>
                    </div>

                    {/* Recovery Badge */}
                    {simulation.results.recoveryApplied && (
                      <div className="mt-3">
                        <Badge variant="success" size="sm">
                          🔄 Recovery Applied
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => handleViewResults(simulation)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => handleReplay(simulation)}
                      disabled={simulation.status === 'running'}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                    >
                      Replay
                    </button>
                    <button
                      onClick={() => handleExport(simulation)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationHistory;

// Made with Bob