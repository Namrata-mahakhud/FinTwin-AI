// Journey Progress Bar Component - Visual progress indicator for user journey

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore, useJourneyProgress } from '@/store/journeyStore';
import { JourneyStage, STAGE_CONFIG } from '@/types/journey.types';

export const JourneyProgressBar: React.FC = () => {
  const navigate = useNavigate();
  const { currentStage, completedStages, canNavigateTo, updateStage, isActive } = useJourneyStore();

  const { progress } = useJourneyProgress();

  if (!isActive) return null;

  const stages = Object.values(JourneyStage);

  const handleStageClick = (stage: JourneyStage) => {
    if (canNavigateTo(stage)) {
      updateStage(stage);
      navigate(STAGE_CONFIG[stage].route);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span>🚀</span>
            <span>Journey Progress</span>
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {progress}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between items-start gap-1">
          {stages.map((stage) => {
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
                  flex flex-col items-center gap-1 transition-all duration-300 flex-1 min-w-0
                  ${canNavigate ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                `}
                title={`${config.label}${!canNavigate ? ' (Locked)' : ''}`}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300 border-2 shadow-md
                    ${
                      isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-200 dark:ring-blue-900'
                        : isCompleted
                          ? 'bg-green-600 border-green-600 text-white hover:scale-105'
                          : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {isCompleted && !isCurrent ? (
                    <span className="text-xl">✓</span>
                  ) : (
                    <span>{config.icon}</span>
                  )}
                </div>
                <span
                  className={`
                    text-xs font-medium text-center max-w-full truncate px-1
                    ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
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
  );
};

// Made with Bob
