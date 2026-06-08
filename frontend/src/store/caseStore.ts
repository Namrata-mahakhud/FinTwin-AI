// Crisis Case Store
// Manages state for crisis cases and case-based workflow

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CrisisCase, CaseStage } from '@/types/case.types';

interface CaseStore {
  // State
  activeCase: CrisisCase | null;
  cases: CrisisCase[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createCase: (
    caseName: string,
    scenarioId: string,
    scenarioName: string,
    portfolioId: string
  ) => void;
  updateCase: (caseId: string, updates: Partial<CrisisCase>) => void;
  setActiveCase: (caseId: string | null) => void;
  advanceStage: () => void;
  updateRisk: (caseId: string, newRisk: number) => void;
  updateLoss: (caseId: string, recoveredLoss: number) => void;
  updateRecoveryProgress: (caseId: string, progress: number) => void;
  addRecommendation: (caseId: string, recommendation: string) => void;
  closeCase: (caseId: string) => void;
  archiveCase: (caseId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const stageOrder: CaseStage[] = [
  'create_scenario',
  'validate',
  'simulate',
  'analyze',
  'recover',
  'compare',
  'close_case',
];

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeCase: null,
      cases: [],
      isLoading: false,
      error: null,

      // Create a new crisis case
      createCase: (caseName, scenarioId, scenarioName, portfolioId) => {
        const newCase: CrisisCase = {
          caseId: `case-${Date.now()}`,
          caseName,
          scenario: {
            id: scenarioId,
            name: scenarioName,
            type: 'market_crash',
            severity: 'high',
          },
          portfolio: {
            id: portfolioId,
            name: 'Default Portfolio',
            value: 2450000,
          },
          status: 'draft',
          currentStage: 'create_scenario',
          initialRisk: 65,
          currentRisk: 65,
          initialLoss: 0,
          recoveredLoss: 0,
          recoveryProgress: 0,
          recommendations: [],
          reportStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          cases: [...state.cases, newCase],
          activeCase: newCase,
          error: null,
        }));
      },

      // Update an existing case
      updateCase: (caseId, updates) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.caseId === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
          activeCase:
            state.activeCase?.caseId === caseId
              ? { ...state.activeCase, ...updates, updatedAt: new Date().toISOString() }
              : state.activeCase,
        }));
      },

      // Set the active case
      setActiveCase: (caseId) => {
        if (caseId === null) {
          set({ activeCase: null });
          return;
        }

        const foundCase = get().cases.find((c) => c.caseId === caseId);
        if (foundCase) {
          set({ activeCase: foundCase, error: null });
        } else {
          set({ error: `Case ${caseId} not found` });
        }
      },

      // Advance to the next stage
      advanceStage: () => {
        const { activeCase } = get();
        if (!activeCase) {
          set({ error: 'No active case to advance' });
          return;
        }

        const currentIndex = stageOrder.indexOf(activeCase.currentStage);
        if (currentIndex < stageOrder.length - 1) {
          const nextStage = stageOrder[currentIndex + 1];
          get().updateCase(activeCase.caseId, {
            currentStage: nextStage,
            status: nextStage === 'close_case' ? 'closed' : activeCase.status,
          });
        }
      },

      // Update risk score
      updateRisk: (caseId, newRisk) => {
        get().updateCase(caseId, { currentRisk: newRisk });
      },

      // Update recovered loss
      updateLoss: (caseId, recoveredLoss) => {
        const caseData = get().cases.find((c) => c.caseId === caseId);
        if (caseData) {
          const progress =
            caseData.initialLoss !== 0
              ? Math.min(100, Math.abs((recoveredLoss / caseData.initialLoss) * 100))
              : 0;

          get().updateCase(caseId, {
            recoveredLoss,
            recoveryProgress: Math.round(progress),
          });
        }
      },

      // Update recovery progress
      updateRecoveryProgress: (caseId, progress) => {
        get().updateCase(caseId, { recoveryProgress: Math.min(100, Math.max(0, progress)) });
      },

      // Add a recommendation
      addRecommendation: (caseId, recommendation) => {
        const caseData = get().cases.find((c) => c.caseId === caseId);
        if (caseData) {
          get().updateCase(caseId, {
            recommendations: [...caseData.recommendations, recommendation],
          });
        }
      },

      // Close a case
      closeCase: (caseId) => {
        get().updateCase(caseId, {
          status: 'closed',
          currentStage: 'close_case',
          reportStatus: 'ready',
        });
      },

      // Archive a case
      archiveCase: (caseId) => {
        get().updateCase(caseId, {
          status: 'archived',
        });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },

      // Reset store
      reset: () => {
        set({
          activeCase: null,
          cases: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'case-storage',
      partialize: (state) => ({
        activeCase: state.activeCase,
        cases: state.cases,
      }),
    }
  )
);

// Made with Bob
