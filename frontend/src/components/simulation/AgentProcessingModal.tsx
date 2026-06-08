// Agent Processing Modal Component
// Step 3: Shows real-time agent execution with progress tracking

import React, { useEffect, useState } from 'react';
import { Modal, LoadingSpinner } from '@/components/common';
import { AgentProgress } from '@/types/simulation-flow.types';

interface AgentProcessingModalProps {
  isOpen: boolean;
  scenarioId: string;
  onComplete: (simulationId: string) => void;
}

const AgentProcessingModal: React.FC<AgentProcessingModalProps> = ({
  isOpen,
  scenarioId,
  onComplete,
}) => {
  const [agents, setAgents] = useState<AgentProgress[]>([
    {
      id: 'market-agent',
      name: 'Market Agent',
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...',
      icon: '📊',
      color: 'blue',
    },
    {
      id: 'risk-agent',
      name: 'Risk Agent',
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...',
      icon: '⚠️',
      color: 'red',
    },
    {
      id: 'portfolio-agent',
      name: 'Portfolio Agent',
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...',
      icon: '💼',
      color: 'purple',
    },
    {
      id: 'recommendation-agent',
      name: 'Recommendation Agent',
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...',
      icon: '🎯',
      color: 'green',
    },
    {
      id: 'reporting-agent',
      name: 'Reporting Agent',
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...',
      icon: '📄',
      color: 'indigo',
    },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing...');

  useEffect(() => {
    if (isOpen && scenarioId) {
      startAgentProcessing();
    }
  }, [isOpen, scenarioId]);

  const startAgentProcessing = async () => {
    // Simulate agent processing sequence
    const agentSequence = [
      {
        id: 'market-agent',
        phases: [
          { progress: 25, message: 'Loading inflation model...', delay: 800 },
          { progress: 50, message: 'Analyzing market conditions...', delay: 1000 },
          { progress: 75, message: 'Calculating correlations...', delay: 800 },
          { progress: 100, message: 'Market analysis complete ✓', delay: 500 },
        ],
      },
      {
        id: 'risk-agent',
        phases: [
          { progress: 30, message: 'Identifying exposures...', delay: 700 },
          { progress: 60, message: 'Banking sector: 35% exposure detected', delay: 900 },
          { progress: 90, message: 'Calculating risk scores...', delay: 700 },
          { progress: 100, message: 'Risk assessment complete ✓', delay: 500 },
        ],
      },
      {
        id: 'portfolio-agent',
        phases: [
          { progress: 20, message: 'Loading portfolio data...', delay: 600 },
          { progress: 50, message: 'Running stress tests...', delay: 1200 },
          { progress: 80, message: 'Calculating loss: -25%', delay: 800 },
          { progress: 100, message: 'Portfolio impact calculated ✓', delay: 500 },
        ],
      },
      {
        id: 'recommendation-agent',
        phases: [
          { progress: 30, message: 'Analyzing risk factors...', delay: 800 },
          { progress: 60, message: 'Generating strategies...', delay: 1000 },
          { progress: 90, message: 'Optimizing recommendations...', delay: 700 },
          { progress: 100, message: 'Recommendations ready ✓', delay: 500 },
        ],
      },
      {
        id: 'reporting-agent',
        phases: [
          { progress: 40, message: 'Compiling results...', delay: 600 },
          { progress: 70, message: 'Generating visualizations...', delay: 800 },
          { progress: 100, message: 'Report complete ✓', delay: 500 },
        ],
      },
    ];

    for (const agent of agentSequence) {
      // Mark agent as running
      updateAgent(agent.id, { status: 'running', startTime: new Date() });

      // Execute phases
      for (const phase of agent.phases) {
        await new Promise((resolve) => setTimeout(resolve, phase.delay));
        updateAgent(agent.id, {
          progress: phase.progress,
          message: phase.message,
        });
      }

      // Mark agent as completed
      updateAgent(agent.id, { status: 'completed', endTime: new Date() });
    }

    // All agents completed
    setCurrentPhase('Simulation Complete!');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate simulation ID and complete
    const simulationId = `sim_${Date.now()}`;
    onComplete(simulationId);
  };

  const updateAgent = (agentId: string, updates: Partial<AgentProgress>) => {
    setAgents((prev) => {
      const updated = prev.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      );

      // Calculate overall progress
      const totalProgress = updated.reduce((sum, a) => sum + a.progress, 0);
      const avgProgress = totalProgress / updated.length;
      setOverallProgress(Math.round(avgProgress));

      // Update current phase
      const runningAgent = updated.find((a) => a.status === 'running');
      if (runningAgent) {
        setCurrentPhase(`${runningAgent.name} Processing...`);
      }

      return updated;
    });
  };

  const getStatusColor = (status: AgentProgress['status']) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (agent: AgentProgress) => {
    if (agent.status === 'completed') {
      return <span className="text-green-500 text-xl">✓</span>;
    }
    if (agent.status === 'running') {
      return <LoadingSpinner size="sm" />;
    }
    if (agent.status === 'error') {
      return <span className="text-red-500 text-xl">✗</span>;
    }
    return <span className="text-gray-400 text-xl">○</span>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing during processing
      title="AI Agent Processing"
      size="lg"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {overallProgress}%
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentPhase}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Running multi-agent simulation analysis
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Agent List */}
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`
                p-4 rounded-lg border-2 transition-all duration-300
                ${getStatusColor(agent.status)}
                ${agent.status === 'running' ? 'animate-pulse-glow' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {getStatusIcon(agent)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.icon}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {agent.progress}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{agent.message}</p>

                  {/* Agent Progress Bar */}
                  {agent.status !== 'pending' && (
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`
                          h-full transition-all duration-500
                          ${
                            agent.status === 'completed'
                              ? 'bg-green-500'
                              : agent.status === 'running'
                                ? 'bg-blue-500'
                                : 'bg-red-500'
                          }
                        `}
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Timing Info */}
                  {agent.startTime && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {agent.endTime ? (
                        <span>
                          Completed in{' '}
                          {Math.round((agent.endTime.getTime() - agent.startTime.getTime()) / 1000)}
                          s
                        </span>
                      ) : (
                        <span>
                          Running for {Math.round((Date.now() - agent.startTime.getTime()) / 1000)}s
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Agentic SDLC Framework</p>
              <p className="text-blue-700 dark:text-blue-400">
                Multiple AI agents are working together to analyze your scenario, assess risks, and
                generate actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgentProcessingModal;

// Made with Bob
