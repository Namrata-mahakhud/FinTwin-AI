// Financial War Room - Crisis Command Center
// Hero page with three-panel layout for real-time simulation monitoring

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Badge, LoadingSpinner } from '@/components/common';
import { SimulationProcessingOverlay } from '@/components/simulation';
import { useSimulation, useSimulationResults } from '@/hooks/useSimulations';

interface TimelineEvent {
  day: number;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

interface AgentActivity {
  agent: string;
  status: 'idle' | 'running' | 'completed';
  message: string;
  icon: string;
  color: string;
}

const FinancialWarRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: simulation, isLoading } = useSimulation(id!);
  const { data: results } = useSimulationResults(id!);
  const warRoomSimulation = simulation as
    | (typeof simulation & {
        severity?: string;
        events?: Array<{ type: string; description?: string }>;
      })
    | undefined;

  const [showProcessing, setShowProcessing] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Timeline events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      day: 1,
      title: 'Inflation rises',
      description: 'Consumer prices increase by 3%',
      icon: '💰',
      status: 'pending',
    },
    {
      day: 5,
      title: 'Banking drops',
      description: 'Banking sector declines 8%',
      icon: '🏦',
      status: 'pending',
    },
    {
      day: 10,
      title: 'Currency weakens',
      description: 'Currency depreciation -12%',
      icon: '💱',
      status: 'pending',
    },
    {
      day: 15,
      title: 'Portfolio impact',
      description: 'Portfolio value falls significantly',
      icon: '📉',
      status: 'pending',
    },
    {
      day: 30,
      title: 'Recovery',
      description: 'Recovery strategies activated',
      icon: '🔄',
      status: 'pending',
    },
  ]);

  // AI Agent activities
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([
    { agent: 'Market Agent', status: 'idle', message: 'Waiting...', icon: '📊', color: 'blue' },
    { agent: 'Risk Agent', status: 'idle', message: 'Waiting...', icon: '⚠️', color: 'red' },
    {
      agent: 'Portfolio Agent',
      status: 'idle',
      message: 'Waiting...',
      icon: '💼',
      color: 'purple',
    },
    { agent: 'Recovery Agent', status: 'idle', message: 'Waiting...', icon: '🎯', color: 'green' },
  ]);

  const handleRunSimulation = () => {
    setShowProcessing(true);
    setIsSimulationRunning(true);
  };

  const handleProcessingComplete = () => {
    setShowProcessing(false);
    startSimulation();
  };

  const startSimulation = () => {
    // Simulate timeline progression
    let day = 0;
    const interval = setInterval(() => {
      day += 1;
      setCurrentDay(day);

      // Update timeline events
      setTimelineEvents((prev) =>
        prev.map((event) => ({
          ...event,
          status: event.day <= day ? 'completed' : event.day === day + 1 ? 'active' : 'pending',
        }))
      );

      // Update agent activities based on day
      if (day === 1) {
        updateAgentActivity('Market Agent', 'running', 'Analyzing inflation impact...');
      } else if (day === 5) {
        updateAgentActivity('Market Agent', 'completed', 'Inflation analysis complete');
        updateAgentActivity('Risk Agent', 'running', 'Exposure detected: Banking 35%');
      } else if (day === 10) {
        updateAgentActivity('Risk Agent', 'completed', 'Risk assessment complete');
        updateAgentActivity('Portfolio Agent', 'running', 'Calculating loss: -25%');
      } else if (day === 15) {
        updateAgentActivity('Portfolio Agent', 'completed', 'Portfolio impact calculated');
        updateAgentActivity('Recovery Agent', 'running', 'Generating recovery plan...');
      } else if (day >= 30) {
        updateAgentActivity('Recovery Agent', 'completed', 'Recommendations ready');
        setTimelineEvents((prev) =>
          prev.map((event) => ({
            ...event,
            status: 'completed',
          }))
        );
        clearInterval(interval);
        setIsSimulationRunning(false);
      }
    }, 800);
  };

  const updateAgentActivity = (agent: string, status: AgentActivity['status'], message: string) => {
    setAgentActivities((prev) =>
      prev.map((a) => (a.agent === agent ? { ...a, status, message } : a))
    );
  };

  const getStatusColor = (status: AgentActivity['status']) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getTimelineStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'active':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500';
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading War Room..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Processing Overlay */}
      <SimulationProcessingOverlay
        isVisible={showProcessing}
        onComplete={handleProcessingComplete}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 px-6 py-4 border-b border-red-600">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>🎯</span>
              Financial War Room
            </h1>
            <p className="text-red-200 text-sm mt-1">
              Crisis Command Center - Real-time Simulation Monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isSimulationRunning && (
              <div className="flex items-center gap-2 bg-red-800 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">SIMULATION ACTIVE</span>
              </div>
            )}
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg transition-colors"
            >
              ← Exit War Room
            </button>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* LEFT PANEL - Scenario Details */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardBody>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                Selected Shock
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Scenario:</div>
                  <div className="text-xl font-bold text-white">
                    {simulation?.name || 'Banking Crisis Q1'}
                  </div>
                  <Badge variant="danger" size="sm" className="mt-2">
                    {warRoomSimulation?.severity || 'HIGH'}
                  </Badge>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm font-semibold text-gray-400 mb-3">Events:</div>
                  <div className="space-y-2">
                    {warRoomSimulation?.events?.slice(0, 3).map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{event.type.replace(/_/g, ' ')}</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300">Inflation +3%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300">Currency Crash</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300">Oil Spike</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400 mb-2">Portfolio Exposure:</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Banking</span>
                      <span className="font-bold text-red-400">35%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Energy</span>
                      <span className="font-bold text-yellow-400">20%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Tech</span>
                      <span className="font-bold text-blue-400">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* CENTER PANEL - Animated Timeline */}
        <div className="col-span-6 overflow-y-auto">
          <Card className="bg-gray-800 border-gray-700 min-h-[850px]">
            <CardBody className="min-h-[800px]">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>📅</span>
                Simulation Timeline
                {currentDay > 0 && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    Day {currentDay} of 30
                  </span>
                )}
              </h2>

              <div className="relative space-y-6 pb-16 min-h-[700px]">
                {/* Timeline Line */}
                <div
                  className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500"
                  style={{ height: '100%', minHeight: '700px' }}
                />

                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`
                      relative pl-20 transition-all duration-500
                      ${event.status === 'active' ? 'scale-105' : ''}
                    `}
                  >
                    {/* Day Marker */}
                    <div className="absolute left-0 flex items-center gap-3">
                      <div
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center text-2xl
                          border-4 border-gray-900 shadow-lg transition-all duration-500
                          ${
                            event.status === 'completed'
                              ? 'bg-green-600'
                              : event.status === 'active'
                                ? 'bg-blue-600 animate-pulse-glow'
                                : 'bg-gray-700'
                          }
                        `}
                      >
                        {event.icon}
                      </div>
                    </div>

                    {/* Event Card */}
                    <div
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-500
                        ${getTimelineStatusColor(event.status)}
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            DAY {event.day}
                          </div>
                          <h4 className="font-bold text-white text-lg">{event.title}</h4>
                        </div>
                        {event.status === 'completed' && (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                        {event.status === 'active' && (
                          <div className="w-6 h-6">
                            <LoadingSpinner size="sm" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT PANEL - AI Agent Activity */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardBody>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🤖</span>
                AI Agent Activity
              </h2>

              <div className="space-y-3">
                {agentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-300
                      ${
                        activity.status === 'running'
                          ? 'border-blue-500 bg-blue-900/20 animate-pulse-glow'
                          : activity.status === 'completed'
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-gray-600 bg-gray-700/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm break-words">
                          {activity.agent}
                        </div>
                        <div className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status === 'running'
                            ? 'Running...'
                            : activity.status === 'completed'
                              ? 'Complete'
                              : 'Idle'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300">{activity.message}</p>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              {currentDay > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-red-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">-25%</div>
                      <div className="text-xs text-gray-400 mt-1">Portfolio Loss</div>
                    </div>
                    <div className="text-center p-3 bg-orange-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">84</div>
                      <div className="text-xs text-gray-400 mt-1">Risk Score</div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* BOTTOM SECTION - Action Buttons */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulationRunning}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg"
          >
            <span>⚡</span>
            {isSimulationRunning ? 'Simulation Running...' : 'Run Simulation'}
          </button>

          <button
            disabled={!isSimulationRunning && currentDay === 0}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            Run Recovery
          </button>

          <button
            disabled={currentDay === 0}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>📊</span>
            Export Report
          </button>

          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
            <span>⚖️</span>
            Compare Scenarios
          </button>

          <button
            disabled={currentDay === 0}
            onClick={() => {
              setCurrentDay(0);
              setTimelineEvents((prev) => prev.map((e) => ({ ...e, status: 'pending' as const })));
              setAgentActivities((prev) =>
                prev.map((a) => ({ ...a, status: 'idle' as const, message: 'Waiting...' }))
              );
              handleRunSimulation();
            }}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔁</span>
            Replay Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialWarRoom;

// Made with Bob
