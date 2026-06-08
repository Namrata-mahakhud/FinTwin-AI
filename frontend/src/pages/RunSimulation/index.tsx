// Run Simulation Page - Multi-Step Simulation Flow
// Orchestrates: Validation → Preview → Agent Processing → Results → Recovery

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScenarioValidationModal,
  ImpactPreviewModal,
  AgentProcessingModal,
  RecoveryActionsModal,
} from '@/components/simulation';
import { useJourneyStore } from '@/store/journeyStore';
import { useSimulationFlowStore } from '@/store/simulationFlowStore';
import { JourneyStage } from '@/types/journey.types';
import { JourneyWrapper } from '@/components/journey';
import { useToastStore } from '@/store/toastStore';
import { ROUTES } from '@/constants/routes';
import { ValidationResult, ImpactPreview, RecoveryResult } from '@/types/simulation-flow.types';

const RunSimulation: React.FC = () => {
  const navigate = useNavigate();
  const { data, setJourneyData, completeStage } = useJourneyStore();
  const { addToast } = useToastStore();

  const {
    currentStep,
    scenarioId,
    setScenarioId,
    setCurrentStep,
    setValidationResult,
    setImpactPreview,
    setSimulationId,
    setRecoveryResult,
    reset,
  } = useSimulationFlowStore();

  // Modal visibility states
  const [showValidation, setShowValidation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAgentProcessing, setShowAgentProcessing] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  // Simulation results
  const [simulationResults, setSimulationResults] = useState<any>(null);

  useEffect(() => {
    // Check if we have a scenario
    if (!data.scenarioId) {
      addToast({
        type: 'error',
        message: 'No scenario found. Please create a scenario first.',
      });
      navigate(ROUTES.SCENARIOS_NEW);
      return;
    }

    // Initialize flow
    setScenarioId(data.scenarioId);

    // Start with validation
    setCurrentStep('validation');
    setShowValidation(true);
  }, []);

  // Step 1: Validation Complete
  const handleValidationComplete = (result: ValidationResult) => {
    setValidationResult(result);
    setShowValidation(false);

    addToast({
      type: 'success',
      message: 'Scenario validation passed!',
    });

    // Move to preview
    setCurrentStep('preview');
    setTimeout(() => setShowPreview(true), 300);
  };

  const handleValidationBack = () => {
    setShowValidation(false);
    navigate(ROUTES.SCENARIOS_NEW);
  };

  // Step 2: Preview Complete
  const handlePreviewComplete = (preview: ImpactPreview) => {
    setImpactPreview(preview);
    setShowPreview(false);

    addToast({
      type: 'info',
      message: 'Starting AI agent analysis...',
    });

    // Move to agent processing
    setCurrentStep('agent-processing');
    setTimeout(() => setShowAgentProcessing(true), 300);
  };

  const handlePreviewBack = () => {
    setShowPreview(false);
    setCurrentStep('validation');
    setTimeout(() => setShowValidation(true), 300);
  };

  // Step 3: Agent Processing Complete
  const handleAgentProcessingComplete = (simulationId: string) => {
    setSimulationId(simulationId);
    setShowAgentProcessing(false);

    // Mock simulation results
    const results = {
      id: simulationId,
      scenarioId: data.scenarioId,
      status: 'completed',
      results: {
        portfolioImpact: -25,
        riskScore: 84,
        affectedAssets: 15,
        recommendations: 8,
        portfolioValue: {
          before: 2450000,
          after: 1837500,
        },
      },
      completedAt: new Date().toISOString(),
    };

    setSimulationResults(results);
    setJourneyData('simulationId', simulationId);
    setJourneyData('simulationResults', results);

    addToast({
      type: 'success',
      message: 'Simulation completed successfully!',
    });

    // Move to recovery
    setCurrentStep('recovery');
    setTimeout(() => setShowRecovery(true), 500);
  };

  // Step 4: Recovery Complete or Skipped
  const handleRecoveryApply = (result: RecoveryResult) => {
    setRecoveryResult(result);
    setShowRecovery(false);

    addToast({
      type: 'success',
      message: `Recovery applied! Risk reduced from ${result.originalRisk} to ${result.newRisk}`,
    });

    // Update simulation results with recovery
    const updatedResults = {
      ...simulationResults,
      results: {
        ...simulationResults.results,
        riskScore: result.newRisk,
        portfolioImpact: result.newLoss,
        recoveryApplied: true,
      },
    };
    setSimulationResults(updatedResults);
    setJourneyData('simulationResults', updatedResults);

    // Navigate to results
    navigateToResults();
  };

  const handleRecoverySkip = () => {
    setShowRecovery(false);

    addToast({
      type: 'info',
      message: 'Recovery skipped. Proceeding to results.',
    });

    // Navigate to results
    navigateToResults();
  };

  const navigateToResults = () => {
    completeStage(JourneyStage.RUN_SIMULATION);

    // Navigate to War Room with simulation results
    setTimeout(() => {
      navigate('/war-room');
    }, 500);
  };

  const handleModalClose = () => {
    // Confirm before closing
    if (window.confirm('Are you sure you want to cancel the simulation?')) {
      reset();
      navigate(ROUTES.SCENARIOS_NEW);
    }
  };

  return (
    <JourneyWrapper stage={JourneyStage.RUN_SIMULATION} showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        {/* Progress Indicator */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-4">
              {/* Step 1 */}
              <div
                className={`flex items-center gap-2 ${currentStep === 'validation' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'validation'
                      ? 'bg-primary-600 text-white'
                      : ['preview', 'agent-processing', 'results', 'recovery'].includes(currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {['preview', 'agent-processing', 'results', 'recovery'].includes(currentStep)
                    ? '✓'
                    : '1'}
                </div>
                <span className="text-sm font-medium hidden md:inline">Validate</span>
              </div>

              <div className="w-8 h-0.5 bg-gray-300" />

              {/* Step 2 */}
              <div
                className={`flex items-center gap-2 ${currentStep === 'preview' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'preview'
                      ? 'bg-primary-600 text-white'
                      : ['agent-processing', 'results', 'recovery'].includes(currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {['agent-processing', 'results', 'recovery'].includes(currentStep) ? '✓' : '2'}
                </div>
                <span className="text-sm font-medium hidden md:inline">Preview</span>
              </div>

              <div className="w-8 h-0.5 bg-gray-300" />

              {/* Step 3 */}
              <div
                className={`flex items-center gap-2 ${currentStep === 'agent-processing' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'agent-processing'
                      ? 'bg-primary-600 text-white'
                      : ['results', 'recovery'].includes(currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {['results', 'recovery'].includes(currentStep) ? '✓' : '3'}
                </div>
                <span className="text-sm font-medium hidden md:inline">Analyze</span>
              </div>

              <div className="w-8 h-0.5 bg-gray-300" />

              {/* Step 4 */}
              <div
                className={`flex items-center gap-2 ${currentStep === 'recovery' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'recovery'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  4
                </div>
                <span className="text-sm font-medium hidden md:inline">Recovery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ScenarioValidationModal
          isOpen={showValidation}
          scenarioId={scenarioId || data.scenarioId || ''}
          onClose={handleModalClose}
          onProceed={handleValidationComplete}
        />

        <ImpactPreviewModal
          isOpen={showPreview}
          scenarioId={scenarioId || data.scenarioId || ''}
          onClose={handleModalClose}
          onProceed={handlePreviewComplete}
          onBack={handlePreviewBack}
        />

        <AgentProcessingModal
          isOpen={showAgentProcessing}
          scenarioId={scenarioId || data.scenarioId || ''}
          onComplete={handleAgentProcessingComplete}
        />

        <RecoveryActionsModal
          isOpen={showRecovery}
          simulationId={simulationResults?.id || ''}
          currentRisk={simulationResults?.results?.riskScore || 84}
          currentLoss={simulationResults?.results?.portfolioImpact || -25}
          onClose={handleModalClose}
          onApply={handleRecoveryApply}
          onSkip={handleRecoverySkip}
        />

        {/* Background Info */}
        {!showValidation && !showPreview && !showAgentProcessing && !showRecovery && (
          <div className="text-center text-white">
            <div className="animate-pulse">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold mb-2">Initializing Simulation...</h2>
              <p className="text-gray-400">Preparing multi-step analysis flow</p>
            </div>
          </div>
        )}
      </div>
    </JourneyWrapper>
  );
};

export default RunSimulation;

// Made with Bob
