// Scenario Detail Page Component

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  LoadingSpinner,
  Modal,
  ModalFooter,
} from '@/components/common';
import { useScenario } from '@/hooks/useScenarios';
import { useRunSimulation, useSimulationStatus } from '@/hooks/useSimulations';
import { SeveritLevel, SimulationStatus } from '@/types';
import { ROUTES, buildRoute } from '@/constants/routes';

const ScenarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: scenario, isLoading, error } = useScenario(id!);
  const runSimulation = useRunSimulation();
  
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [runningSimulationId, setRunningSimulationId] = useState<string | null>(null);
  
  // Poll simulation status if one is running
  const { data: simulationStatus } = useSimulationStatus(
    runningSimulationId || '',
    !!runningSimulationId
  );

  const getSeverityColor = (severity: SeveritLevel) => {
    switch (severity) {
      case SeveritLevel.LOW:
        return 'success';
      case SeveritLevel.MEDIUM:
        return 'warning';
      case SeveritLevel.HIGH:
        return 'danger';
      case SeveritLevel.CRITICAL:
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleRunSimulation = async () => {
    if (!scenario) return;

    try {
      const result = await runSimulation.mutateAsync({
        scenarioId: scenario.id,
        portfolioId: 'default-portfolio', // TODO: Get from user's portfolio
        name: `Simulation: ${scenario.name}`,
        parameters: {
          timeHorizon: 90,
          iterations: 1000,
          confidenceLevel: 95,
          includeStressTests: true,
        },
      });
      
      setRunningSimulationId(result.id);
      setShowSimulationModal(false);
    } catch (error) {
      console.error('Failed to run simulation:', error);
    }
  };

  // Navigate to Financial War Room when simulation completes
  React.useEffect(() => {
    if (
      simulationStatus?.status === SimulationStatus.COMPLETED &&
      runningSimulationId
    ) {
      // Navigate to the Financial War Room (Crisis Command Center)
      navigate(`/simulations/${runningSimulationId}/war-room`);
    }
  }, [simulationStatus?.status, runningSimulationId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading scenario..." />
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Failed to load scenario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {scenario.name}
            </h1>
            <Badge variant={getSeverityColor(scenario.severity)} size="lg">
              {scenario.severity}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{scenario.description}</p>
        </div>
        <button
          onClick={() => setShowSimulationModal(true)}
          disabled={runSimulation.isPending || !!runningSimulationId}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span>⚡</span>
          {runningSimulationId ? 'Simulation Running...' : 'Run Simulation'}
        </button>
      </div>

      {/* Simulation Progress */}
      {runningSimulationId && simulationStatus && (
        <Card className="border-2 border-primary-500">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Simulation in Progress
              </h3>
              <Badge variant="info">{simulationStatus.status}</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {simulationStatus.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${simulationStatus.progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Running Monte Carlo simulation with 1,000 iterations...
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Scenario Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Scenario Type
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {scenario.type.replace(/_/g, ' ')}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Status
            </h3>
            <Badge variant="success" size="lg">
              {scenario.status}
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Events
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {scenario.events.length} Economic Events
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Economic Events */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Economic Events
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {scenario.events.map((event, index) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {event.type.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  </div>
                  <Badge variant="info">{event.probability}% probability</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Impact Magnitude
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.impact.magnitude > 0 ? '+' : ''}
                      {event.impact.magnitude}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Affected Markets
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.impact.markets.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.timeframe.duration} days
                    </p>
                  </div>
                </div>

                {event.impact.sectors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Affected Sectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.impact.sectors.map((sector) => (
                        <Badge key={sector} variant="warning" size="sm">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Metadata
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(scenario.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Last Updated
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(scenario.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {scenario.tags && scenario.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {scenario.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Simulation Confirmation Modal */}
      <Modal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
        title="Run Simulation"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This will run a Monte Carlo simulation with the following parameters:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Horizon:</span>
              <span className="font-medium text-gray-900 dark:text-white">90 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Iterations:</span>
              <span className="font-medium text-gray-900 dark:text-white">1,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Confidence Level:</span>
              <span className="font-medium text-gray-900 dark:text-white">95%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stress Tests:</span>
              <span className="font-medium text-gray-900 dark:text-white">Enabled</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estimated time: 30-60 seconds
          </p>
        </div>
        <ModalFooter>
          <button
            onClick={() => setShowSimulationModal(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={runSimulation.isPending}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {runSimulation.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Starting...
              </>
            ) : (
              <>
                <span>⚡</span>
                Run Simulation
              </>
            )}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ScenarioDetail;

// Made with Bob
