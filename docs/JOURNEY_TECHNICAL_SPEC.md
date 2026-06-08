# FinTwin AI Journey - Technical Specification

## Overview

This document provides detailed technical specifications for implementing the user journey transformation in FinTwin AI.

---

## Architecture Components

### 1. Journey Context & State Management

#### Journey Store (Zustand)

**File:** `frontend/src/store/journeyStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum JourneyStage {
  DASHBOARD = 'dashboard',
  CREATE_SCENARIO = 'create_scenario',
  RUN_SIMULATION = 'run_simulation',
  CRISIS_CENTER = 'crisis_center',
  PORTFOLIO_IMPACT = 'portfolio_impact',
  RISK_HEATMAP = 'risk_heatmap',
  AI_RECOMMENDATIONS = 'ai_recommendations',
  RECOVERY_SIMULATION = 'recovery_simulation',
  AGENT_STUDIO = 'agent_studio',
  EXPORT_REPORT = 'export_report',
}

interface JourneyData {
  scenarioId?: string;
  simulationId?: string;
  scenario?: any;
  simulationResults?: any;
  recommendations?: any[];
  appliedActions?: string[];
  recoveryData?: any;
}

interface JourneyState {
  // Current state
  isActive: boolean;
  currentStage: JourneyStage;
  completedStages: JourneyStage[];
  journeyId: string | null;
  startedAt: Date | null;
  
  // Journey data
  data: JourneyData;
  
  // Actions
  startJourney: (scenarioId?: string) => void;
  updateStage: (stage: JourneyStage) => void;
  completeStage: (stage: JourneyStage) => void;
  setJourneyData: (key: keyof JourneyData, value: any) => void;
  canNavigateTo: (stage: JourneyStage) => boolean;
  getNextStage: () => JourneyStage | null;
  getPreviousStage: () => JourneyStage | null;
  resetJourney: () => void;
  completeJourney: () => void;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStage: JourneyStage.DASHBOARD,
      completedStages: [],
      journeyId: null,
      startedAt: null,
      data: {},
      
      startJourney: (scenarioId) => {
        const journeyId = `journey_${Date.now()}`;
        set({
          isActive: true,
          journeyId,
          startedAt: new Date(),
          currentStage: JourneyStage.CREATE_SCENARIO,
          completedStages: [JourneyStage.DASHBOARD],
          data: scenarioId ? { scenarioId } : {},
        });
      },
      
      updateStage: (stage) => {
        set({ currentStage: stage });
      },
      
      completeStage: (stage) => {
        const { completedStages } = get();
        if (!completedStages.includes(stage)) {
          set({ completedStages: [...completedStages, stage] });
        }
      },
      
      setJourneyData: (key, value) => {
        set((state) => ({
          data: { ...state.data, [key]: value },
        }));
      },
      
      canNavigateTo: (stage) => {
        const { completedStages } = get();
        const stageOrder = Object.values(JourneyStage);
        const targetIndex = stageOrder.indexOf(stage);
        const currentIndex = stageOrder.indexOf(get().currentStage);
        
        // Can navigate to completed stages or next stage
        return completedStages.includes(stage) || targetIndex === currentIndex + 1;
      },
      
      getNextStage: () => {
        const stages = Object.values(JourneyStage);
        const currentIndex = stages.indexOf(get().currentStage);
        return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
      },
      
      getPreviousStage: () => {
        const stages = Object.values(JourneyStage);
        const currentIndex = stages.indexOf(get().currentStage);
        return currentIndex > 0 ? stages[currentIndex - 1] : null;
      },
      
      resetJourney: () => {
        set({
          isActive: false,
          currentStage: JourneyStage.DASHBOARD,
          completedStages: [],
          journeyId: null,
          startedAt: null,
          data: {},
        });
      },
      
      completeJourney: () => {
        set({
          isActive: false,
          completedStages: [...get().completedStages, JourneyStage.EXPORT_REPORT],
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
      }),
    }
  )
);
```

---

### 2. Journey Progress Bar Component

**File:** `frontend/src/components/journey/JourneyProgressBar.tsx`

```typescript
import React from 'react';
import { useJourneyStore, JourneyStage } from '@/store/journeyStore';
import { useNavigate } from 'react-router-dom';

const STAGE_CONFIG = {
  [JourneyStage.DASHBOARD]: { label: 'Dashboard', icon: '🏠', route: '/dashboard' },
  [JourneyStage.CREATE_SCENARIO]: { label: 'Create', icon: '📝', route: '/scenarios/new' },
  [JourneyStage.RUN_SIMULATION]: { label: 'Simulate', icon: '⚡', route: '/simulations/run' },
  [JourneyStage.CRISIS_CENTER]: { label: 'War Room', icon: '🎯', route: '/war-room' },
  [JourneyStage.PORTFOLIO_IMPACT]: { label: 'Impact', icon: '💼', route: '/portfolio/impact' },
  [JourneyStage.RISK_HEATMAP]: { label: 'Risk', icon: '🔥', route: '/risk-heatmap' },
  [JourneyStage.AI_RECOMMENDATIONS]: { label: 'AI Insights', icon: '🤖', route: '/recommendations' },
  [JourneyStage.RECOVERY_SIMULATION]: { label: 'Recovery', icon: '🔄', route: '/recovery' },
  [JourneyStage.AGENT_STUDIO]: { label: 'Agents', icon: '⚙️', route: '/agent-studio' },
  [JourneyStage.EXPORT_REPORT]: { label: 'Export', icon: '📊', route: '/export' },
};

export const JourneyProgressBar: React.FC = () => {
  const navigate = useNavigate();
  const { currentStage, completedStages, canNavigateTo, updateStage, isActive } = useJourneyStore();
  
  if (!isActive) return null;
  
  const stages = Object.values(JourneyStage);
  const currentIndex = stages.indexOf(currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;
  
  const handleStageClick = (stage: JourneyStage) => {
    if (canNavigateTo(stage)) {
      updateStage(stage);
      navigate(STAGE_CONFIG[stage].route);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Journey Progress
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Stage Indicators */}
          <div className="flex justify-between mt-4">
            {stages.map((stage, index) => {
              const config = STAGE_CONFIG[stage];
              const isCompleted = completedStages.includes(stage);
              const isCurrent = stage === currentStage;
              const canNavigate = canNavigateTo(stage);
              
              return (
                <button
                  key={stage}
                  onClick={() => handleStageClick(stage)}
                  disabled={!canNavigate}
                  className={`
                    flex flex-col items-center gap-1 transition-all
                    ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  `}
                  title={config.label}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg
                      transition-all duration-300 border-2
                      ${isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                        : isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500'
                      }
                    `}
                  >
                    {isCompleted && !isCurrent ? '✓' : config.icon}
                  </div>
                  <span
                    className={`
                      text-xs font-medium text-center max-w-[60px]
                      ${isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}
                  >
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 3. Contextual Navigation Component

**File:** `frontend/src/components/journey/ContextualNavigation.tsx`

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore, JourneyStage } from '@/store/journeyStore';

const STAGE_ROUTES: Record<JourneyStage, string> = {
  [JourneyStage.DASHBOARD]: '/dashboard',
  [JourneyStage.CREATE_SCENARIO]: '/scenarios/new',
  [JourneyStage.RUN_SIMULATION]: '/simulations/run',
  [JourneyStage.CRISIS_CENTER]: '/war-room',
  [JourneyStage.PORTFOLIO_IMPACT]: '/portfolio/impact',
  [JourneyStage.RISK_HEATMAP]: '/risk-heatmap',
  [JourneyStage.AI_RECOMMENDATIONS]: '/recommendations',
  [JourneyStage.RECOVERY_SIMULATION]: '/recovery',
  [JourneyStage.AGENT_STUDIO]: '/agent-studio',
  [JourneyStage.EXPORT_REPORT]: '/export',
};

const STAGE_LABELS: Record<JourneyStage, string> = {
  [JourneyStage.DASHBOARD]: 'Dashboard',
  [JourneyStage.CREATE_SCENARIO]: 'Create Scenario',
  [JourneyStage.RUN_SIMULATION]: 'Run Simulation',
  [JourneyStage.CRISIS_CENTER]: 'Crisis Center',
  [JourneyStage.PORTFOLIO_IMPACT]: 'Portfolio Impact',
  [JourneyStage.RISK_HEATMAP]: 'Risk Heatmap',
  [JourneyStage.AI_RECOMMENDATIONS]: 'AI Recommendations',
  [JourneyStage.RECOVERY_SIMULATION]: 'Recovery Simulation',
  [JourneyStage.AGENT_STUDIO]: 'Agent Studio',
  [JourneyStage.EXPORT_REPORT]: 'Export Report',
};

interface ContextualNavigationProps {
  onNext?: () => Promise<boolean> | boolean;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  showProgress?: boolean;
}

export const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  onNext,
  onPrevious,
  nextLabel,
  previousLabel,
  showProgress = true,
}) => {
  const navigate = useNavigate();
  const {
    currentStage,
    getNextStage,
    getPreviousStage,
    updateStage,
    completeStage,
    isActive,
  } = useJourneyStore();
  
  if (!isActive) return null;
  
  const nextStage = getNextStage();
  const previousStage = getPreviousStage();
  
  const handleNext = async () => {
    // Execute custom validation if provided
    if (onNext) {
      const canProceed = await onNext();
      if (!canProceed) return;
    }
    
    // Mark current stage as complete
    completeStage(currentStage);
    
    // Navigate to next stage
    if (nextStage) {
      updateStage(nextStage);
      navigate(STAGE_ROUTES[nextStage]);
    }
  };
  
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    
    if (previousStage) {
      updateStage(previousStage);
      navigate(STAGE_ROUTES[previousStage]);
    }
  };
  
  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={!previousStage}
          className="
            px-6 py-3 rounded-lg font-medium transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-900 dark:text-white
            flex items-center gap-2
          "
        >
          <span>←</span>
          <span>{previousLabel || (previousStage ? `Back to ${STAGE_LABELS[previousStage]}` : 'Back')}</span>
        </button>
        
        {/* Progress Info */}
        {showProgress && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current: <span className="font-semibold text-gray-900 dark:text-white">{STAGE_LABELS[currentStage]}</span>
            </p>
            {nextStage && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Next: {STAGE_LABELS[nextStage]}
              </p>
            )}
          </div>
        )}
        
        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!nextStage}
          className="
            px-6 py-3 rounded-lg font-medium transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            text-white shadow-lg hover:shadow-xl
            flex items-center gap-2
          "
        >
          <span>{nextLabel || (nextStage ? `Continue to ${STAGE_LABELS[nextStage]}` : 'Complete')}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
```

---

### 4. Journey Wrapper Component

**File:** `frontend/src/components/journey/JourneyWrapper.tsx`

```typescript
import React, { useEffect } from 'react';
import { useJourneyStore, JourneyStage } from '@/store/journeyStore';
import { JourneyProgressBar } from './JourneyProgressBar';
import { ContextualNavigation } from './ContextualNavigation';

interface JourneyWrapperProps {
  stage: JourneyStage;
  children: React.ReactNode;
  onNext?: () => Promise<boolean> | boolean;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  showNavigation?: boolean;
  showProgress?: boolean;
}

export const JourneyWrapper: React.FC<JourneyWrapperProps> = ({
  stage,
  children,
  onNext,
  onPrevious,
  nextLabel,
  previousLabel,
  showNavigation = true,
  showProgress = true,
}) => {
  const { updateStage, isActive } = useJourneyStore();
  
  useEffect(() => {
    if (isActive) {
      updateStage(stage);
    }
  }, [stage, isActive, updateStage]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {showProgress && <JourneyProgressBar />}
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {showNavigation && (
        <ContextualNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          nextLabel={nextLabel}
          previousLabel={previousLabel}
          showProgress={showProgress}
        />
      )}
    </div>
  );
};
```

---

## Integration Examples

### Example 1: Scenario Builder with Journey

```typescript
// frontend/src/pages/ScenarioBuilder/index.tsx

import { JourneyWrapper } from '@/components/journey/JourneyWrapper';
import { JourneyStage, useJourneyStore } from '@/store/journeyStore';

const ScenarioBuilder: React.FC = () => {
  const { setJourneyData } = useJourneyStore();
  const [scenarioData, setScenarioData] = useState({});
  
  const handleNext = async () => {
    // Validate scenario
    if (!scenarioData.name || !scenarioData.events) {
      toast.error('Please complete all required fields');
      return false;
    }
    
    // Save scenario
    const scenario = await createScenario(scenarioData);
    setJourneyData('scenarioId', scenario.id);
    setJourneyData('scenario', scenario);
    
    return true;
  };
  
  return (
    <JourneyWrapper
      stage={JourneyStage.CREATE_SCENARIO}
      onNext={handleNext}
      nextLabel="Run Simulation"
    >
      {/* Existing scenario builder UI */}
    </JourneyWrapper>
  );
};
```

### Example 2: War Room with Journey

```typescript
// frontend/src/pages/FinancialWarRoom/index.tsx

import { JourneyWrapper } from '@/components/journey/JourneyWrapper';
import { JourneyStage, useJourneyStore } from '@/store/journeyStore';

const FinancialWarRoom: React.FC = () => {
  const { data, setJourneyData } = useJourneyStore();
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  const handleNext = () => {
    if (!simulationComplete) {
      toast.error('Please wait for simulation to complete');
      return false;
    }
    return true;
  };
  
  return (
    <JourneyWrapper
      stage={JourneyStage.CRISIS_CENTER}
      onNext={handleNext}
      nextLabel="View Portfolio Impact"
    >
      {/* Existing war room UI */}
    </JourneyWrapper>
  );
};
```

---

## Routing Updates

**File:** `frontend/src/router/index.tsx`

Add journey-aware routing:

```typescript
import { JourneyStage } from '@/store/journeyStore';

// Add journey routes
{
  path: '/journey',
  element: <PrivateRoute><MainLayout /></PrivateRoute>,
  children: [
    {
      path: 'scenario',
      element: <ScenarioBuilder />,
    },
    {
      path: 'simulate',
      element: <RunSimulation />,
    },
    {
      path: 'war-room',
      element: <FinancialWarRoom />,
    },
    // ... other journey routes
  ],
}
```

---

## Testing Strategy

### Unit Tests
- Journey store state management
- Navigation logic
- Stage validation
- Data persistence

### Integration Tests
- Complete journey flow
- Stage transitions
- Data passing between stages
- Error handling

### E2E Tests
- Full user journey from start to finish
- Resume journey functionality
- Multiple concurrent journeys
- Edge cases and error scenarios

---

## Performance Considerations

1. **Code Splitting** - Lazy load journey components
2. **State Optimization** - Only persist essential data
3. **Memoization** - Use React.memo for heavy components
4. **Debouncing** - Debounce auto-save functionality
5. **Caching** - Cache API responses during journey

---

## Accessibility

- Keyboard navigation support
- Screen reader announcements for stage changes
- ARIA labels for progress indicators
- Focus management during transitions
- High contrast mode support

---

## Analytics Events

Track these events:
- `journey_started`
- `journey_stage_completed`
- `journey_stage_skipped`
- `journey_abandoned`
- `journey_completed`
- `journey_resumed`

---

## Next Steps

1. Review and approve technical specifications
2. Set up development environment
3. Create feature branch
4. Begin implementation Phase 1
5. Set up testing infrastructure
