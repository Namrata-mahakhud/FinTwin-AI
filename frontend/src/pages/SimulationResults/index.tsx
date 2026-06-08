// Simulation Results Page Component

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Badge, LoadingSpinner } from '@/components/common';
import { useSimulation, useSimulationResults } from '@/hooks/useSimulations';
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

interface TimelineEvent {
  month: string;
  event: string;
  icon: string;
  impact: number;
  riskScore: number;
  description: string;
}

const SimulationResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: simulation, isLoading: simLoading } = useSimulation(id!);
  const { data: results, isLoading: resultsLoading } = useSimulationResults(id!);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [showExplainability, setShowExplainability] = useState(false);

  // Mock timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      month: 'Jan',
      event: 'Interest Rate +1%',
      icon: '📈',
      impact: -2.3,
      riskScore: 52,
      description: 'Federal Reserve increases interest rates by 1%',
    },
    {
      month: 'Feb',
      event: 'Banking Drop -3%',
      icon: '🏦',
      impact: -3.0,
      riskScore: 58,
      description: 'Banking sector experiences significant downturn',
    },
    {
      month: 'Mar',
      event: 'Inflation +2%',
      icon: '💰',
      impact: -2.5,
      riskScore: 70,
      description: 'Consumer price index rises sharply',
    },
    {
      month: 'Apr',
      event: 'Market Correction',
      icon: '📊',
      impact: -1.2,
      riskScore: 60,
      description: 'Market begins correction phase',
    },
    {
      month: 'May',
      event: 'Recovery Begins',
      icon: '✅',
      impact: 0.5,
      riskScore: 55,
      description: 'Portfolio shows signs of recovery',
    },
  ];

  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-green-600 dark:text-green-400';
    if (score < 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score < 80) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const explainabilityChain = [
    {
      step: 'Interest Rate ↑ +1.5%',
      icon: '📈',
      description: 'Federal Reserve increases rates to combat inflation',
    },
    {
      step: 'Bank Loans More Expensive',
      icon: '💰',
      description: 'Higher borrowing costs for businesses and consumers',
    },
    {
      step: 'Banking Sector Growth Slows',
      icon: '🏦',
      description: 'Reduced lending activity impacts bank profitability',
    },
    {
      step: 'Banking Stocks Drop -8%',
      icon: '📉',
      description: 'Market reacts to lower earnings expectations',
    },
    {
      step: 'Portfolio Impact (35% exposure)',
      icon: '💼',
      description: 'High banking sector allocation amplifies losses',
    },
    {
      step: 'Risk Score: 58 → 70 (+12)',
      icon: '⚠️',
      description: 'Overall portfolio risk increases significantly',
    },
  ];

  const contributingFactors = [
    { factor: 'Banking exposure', value: '35%', severity: 'High' },
    { factor: 'Sector correlation', value: '0.85', severity: 'High' },
    { factor: 'Market volatility', value: '+15%', severity: 'Medium' },
  ];

  const mitigationActions = [
    { action: 'Reduce banking to 25%', status: 'recommended' },
    { action: 'Increase bond allocation', status: 'recommended' },
    { action: 'Add defensive stocks', status: 'optional' },
  ];

  if (simLoading || resultsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading simulation results..." />
      </div>
    );
  }

  if (!simulation || !results) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Failed to load simulation results</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simulation Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{simulation.name}</p>
        </div>
        <button
          onClick={() => setShowExplainability(!showExplainability)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>🔍</span>
          {showExplainability ? 'Hide' : 'Show'} Explainability
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Loss</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {results.summary.expectedLoss.toFixed(1)}%
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Increase</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              +{Math.round(results.summary.expectedLoss * 1.5)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recovery Time</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {results.summary.timeToRecovery || 68} days
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {results.summary.confidenceLevel}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Explainability Panel */}
      {showExplainability && (
        <Card className="border-2 border-primary-500 animate-slide-up">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Why did risk increase by 12 points?
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Cause-Effect Chain */}
              <div className="relative">
                {explainabilityChain.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.step}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {index < explainabilityChain.length - 1 && (
                      <div className="ml-6 mb-4">
                        <div className="w-0.5 h-8 bg-primary-300 dark:bg-primary-700" />
                        <div className="text-primary-600 dark:text-primary-400 text-xl">↓</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contributing Factors */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Contributing Factors:
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {contributingFactors.map((factor, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {factor.factor}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {factor.value}
                      </p>
                      <Badge variant={factor.severity === 'High' ? 'danger' : 'warning'} size="sm">
                        {factor.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitigation Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Mitigation Actions:
                </h3>
                <div className="space-y-2">
                  {mitigationActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-gray-900 dark:text-white">{action.action}</span>
                      </div>
                      <Badge
                        variant={action.status === 'recommended' ? 'success' : 'info'}
                        size="sm"
                      >
                        {action.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Timeline Simulation View */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Timeline Simulation View
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              <div className="flex justify-between items-start">
                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 relative animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Event Card */}
                    <button
                      onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                      className={`
                        w-full max-w-[180px] p-4 rounded-lg border-2 transition-all
                        ${
                          selectedEvent === index
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">{event.icon}</div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        {event.month}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{event.event}</p>
                      <p
                        className={`text-sm font-bold ${event.impact < 0 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {event.impact > 0 ? '+' : ''}
                        {event.impact}%
                      </p>
                      <p className={`text-xs font-medium mt-1 ${getRiskColor(event.riskScore)}`}>
                        Risk: {event.riskScore}
                      </p>
                    </button>

                    {/* Connector Line */}
                    {index < timelineEvents.length - 1 && (
                      <div className="absolute top-12 left-1/2 w-full h-0.5 bg-gray-300 dark:bg-gray-600 -z-10" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Event Details */}
            {selectedEvent !== null && (
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 animate-fade-in">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {timelineEvents[selectedEvent].event} - {timelineEvents[selectedEvent].month}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {timelineEvents[selectedEvent].description}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Portfolio Impact Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Portfolio Value Projection
          </h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
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
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
              <Line
                type="monotone"
                dataKey="confidence.lower"
                stroke="#9CA3AF"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confidence.upper"
                stroke="#9CA3AF"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Sector Impact */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Impact by Sector</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results.impactBySector}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sector" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="percentChange" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Recommendations
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {results.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                  <Badge
                    variant={
                      rec.priority === 'high' || rec.priority === 'critical' ? 'danger' : 'warning'
                    }
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Expected Impact: {rec.expectedImpact > 0 ? '+' : ''}
                  {rec.expectedImpact}%
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SimulationResults;

// Made with Bob
