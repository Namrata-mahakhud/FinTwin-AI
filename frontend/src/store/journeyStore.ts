// Journey Store - State Management for User Journey Flow

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JourneyStage, JourneyState, JourneyData } from '@/types/journey.types';
import { journeyAnalytics, JourneyEvent } from '@/services/journeyAnalytics';

const STAGE_ORDER = Object.values(JourneyStage);

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      // Initial state
      isActive: false,
      currentStage: JourneyStage.DASHBOARD,
      completedStages: [],
      journeyId: null,
      startedAt: null,
      data: {},

      // Start a new journey
      startJourney: (scenarioId?: string) => {
        const journeyId = `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set({
          isActive: true,
          journeyId,
          startedAt: new Date(),
          currentStage: JourneyStage.CREATE_SCENARIO,
          completedStages: [JourneyStage.DASHBOARD],
          data: scenarioId ? { scenarioId } : {},
        });

        // Track analytics
        journeyAnalytics.trackJourneyStart(journeyId, { scenarioId });
      },

      // Update current stage
      updateStage: (stage: JourneyStage) => {
        const { journeyId } = get();
        set({ currentStage: stage });

        // Track analytics
        if (journeyId) {
          journeyAnalytics.trackStageEnter(journeyId, stage);
        }
      },

      // Mark a stage as completed
      completeStage: (stage: JourneyStage) => {
        const { completedStages, journeyId } = get();
        if (!completedStages.includes(stage)) {
          set({ completedStages: [...completedStages, stage] });

          // Track analytics
          if (journeyId) {
            journeyAnalytics.trackStageComplete(journeyId, stage);
          }
        }
      },

      // Set journey data
      setJourneyData: (key: keyof JourneyData, value: any) => {
        const { journeyId, currentStage } = get();
        set((state) => ({
          data: { ...state.data, [key]: value },
        }));

        // Track analytics
        if (journeyId) {
          journeyAnalytics.trackDataSaved(journeyId, currentStage, key);
        }
      },

      // Check if user can navigate to a stage
      canNavigateTo: (stage: JourneyStage) => {
        const { completedStages, currentStage } = get();
        const targetIndex = STAGE_ORDER.indexOf(stage);
        const currentIndex = STAGE_ORDER.indexOf(currentStage);

        // Can navigate to completed stages
        if (completedStages.includes(stage)) {
          return true;
        }

        // Can navigate to next stage
        if (targetIndex === currentIndex + 1) {
          return true;
        }

        // Can navigate to current stage
        if (stage === currentStage) {
          return true;
        }

        return false;
      },

      // Get next stage in the journey
      getNextStage: () => {
        const { currentStage } = get();
        const currentIndex = STAGE_ORDER.indexOf(currentStage);

        if (currentIndex < STAGE_ORDER.length - 1) {
          return STAGE_ORDER[currentIndex + 1];
        }

        return null;
      },

      // Get previous stage in the journey
      getPreviousStage: () => {
        const { currentStage } = get();
        const currentIndex = STAGE_ORDER.indexOf(currentStage);

        if (currentIndex > 0) {
          return STAGE_ORDER[currentIndex - 1];
        }

        return null;
      },

      // Reset journey to initial state
      resetJourney: () => {
        const { journeyId } = get();

        // Track analytics
        if (journeyId) {
          journeyAnalytics.trackJourneyReset(journeyId);
        }

        set({
          isActive: false,
          currentStage: JourneyStage.DASHBOARD,
          completedStages: [],
          journeyId: null,
          startedAt: null,
          data: {},
        });
      },

      // Complete the journey
      completeJourney: () => {
        const { completedStages, journeyId, data } = get();

        // Track analytics
        if (journeyId) {
          journeyAnalytics.trackJourneyComplete(journeyId, {
            totalStages: completedStages.length,
            hasScenario: !!data.scenarioId,
            hasSimulation: !!data.simulationId,
            hasRecommendations: !!data.recommendations,
          });
        }

        set({
          isActive: false,
          completedStages: [...completedStages, JourneyStage.EXPORT_REPORT],
        });
      },
    }),
    {
      name: 'fintwin-journey-storage',
      partialize: (state) => ({
        journeyId: state.journeyId,
        currentStage: state.currentStage,
        completedStages: state.completedStages,
        data: state.data,
        isActive: state.isActive,
        startedAt: state.startedAt,
      }),
    }
  )
);

// Helper hooks for common operations
export const useJourneyProgress = () => {
  const { currentStage, completedStages } = useJourneyStore();
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const progress = ((currentIndex + 1) / STAGE_ORDER.length) * 100;

  return {
    progress: Math.round(progress),
    currentIndex,
    totalStages: STAGE_ORDER.length,
    completedCount: completedStages.length,
  };
};

export const useJourneyNavigation = () => {
  const { getNextStage, getPreviousStage, canNavigateTo, updateStage, completeStage } =
    useJourneyStore();

  return {
    getNextStage,
    getPreviousStage,
    canNavigateTo,
    updateStage,
    completeStage,
  };
};

// Made with Bob
