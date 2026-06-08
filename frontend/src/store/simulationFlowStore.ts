// Simulation Flow Store
// Manages state for multi-step simulation execution

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SimulationFlowState,
  SimulationFlowStep,
  ValidationResult,
  ImpactPreview,
  AgentProgress,
  RecoveryAction,
  RecoveryResult,
} from '@/types/simulation-flow.types';

interface SimulationFlowStore extends SimulationFlowState {
  // Actions
  setCurrentStep: (step: SimulationFlowStep) => void;
  setScenarioId: (scenarioId: string) => void;
  setValidationResult: (result: ValidationResult) => void;
  setImpactPreview: (preview: ImpactPreview) => void;
  setAgentProgress: (progress: AgentProgress[]) => void;
  updateAgentProgress: (agentId: string, updates: Partial<AgentProgress>) => void;
  setSimulationId: (simulationId: string) => void;
  toggleRecoveryAction: (actionId: string) => void;
  setRecoveryResult: (result: RecoveryResult) => void;
  setError: (error: string | undefined) => void;
  reset: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const initialState: SimulationFlowState = {
  currentStep: 'validation',
  scenarioId: undefined,
  validationResult: undefined,
  impactPreview: undefined,
  agentProgress: undefined,
  simulationId: undefined,
  selectedRecoveryActions: undefined,
  recoveryResult: undefined,
  error: undefined,
};

const stepOrder: SimulationFlowStep[] = [
  'validation',
  'preview',
  'agent-processing',
  'results',
  'recovery',
];

export const useSimulationFlowStore = create<SimulationFlowStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      setScenarioId: (scenarioId) => set({ scenarioId }),

      setValidationResult: (result) => set({ validationResult: result }),

      setImpactPreview: (preview) => set({ impactPreview: preview }),

      setAgentProgress: (progress) => set({ agentProgress: progress }),

      updateAgentProgress: (agentId, updates) =>
        set((state) => ({
          agentProgress: state.agentProgress?.map((agent) =>
            agent.id === agentId ? { ...agent, ...updates } : agent
          ),
        })),

      setSimulationId: (simulationId) => set({ simulationId }),

      toggleRecoveryAction: (actionId) =>
        set((state) => ({
          selectedRecoveryActions: state.selectedRecoveryActions?.map((action) =>
            action.id === actionId ? { ...action, selected: !action.selected } : action
          ),
        })),

      setRecoveryResult: (result) => set({ recoveryResult: result }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),

      goToNextStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex < stepOrder.length - 1) {
          set({ currentStep: stepOrder[currentIndex + 1] });
        }
      },

      goToPreviousStep: () => {
        const currentIndex = stepOrder.indexOf(get().currentStep);
        if (currentIndex > 0) {
          set({ currentStep: stepOrder[currentIndex - 1] });
        }
      },
    }),
    {
      name: 'simulation-flow-storage',
      partialize: (state) => ({
        scenarioId: state.scenarioId,
        simulationId: state.simulationId,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Made with Bob
