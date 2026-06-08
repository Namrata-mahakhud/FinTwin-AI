// Contextual Navigation Component - Smart next/previous buttons for journey flow

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore, useJourneyNavigation } from '@/store/journeyStore';
import { STAGE_CONFIG } from '@/types/journey.types';
import { LoadingSpinner } from '@/components/common';

interface ContextualNavigationProps {
  onNext?: () => Promise<boolean> | boolean;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  showProgress?: boolean;
  hideNext?: boolean;
  hidePrevious?: boolean;
}

export const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  onNext,
  onPrevious,
  nextLabel,
  previousLabel,
  showProgress = true,
  hideNext = false,
  hidePrevious = false,
}) => {
  const navigate = useNavigate();
  const { currentStage, isActive } = useJourneyStore();
  const { getNextStage, getPreviousStage, updateStage, completeStage } = useJourneyNavigation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isActive) return null;
  
  const nextStage = getNextStage();
  const previousStage = getPreviousStage();
  
  const handleNext = async () => {
    setIsProcessing(true);
    
    try {
      // Execute custom validation if provided
      if (onNext) {
        const canProceed = await onNext();
        if (!canProceed) {
          setIsProcessing(false);
          return;
        }
      }
      
      // Mark current stage as complete
      completeStage(currentStage);
      
      // Navigate to next stage
      if (nextStage) {
        updateStage(nextStage);
        navigate(STAGE_CONFIG[nextStage].route);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    
    if (previousStage) {
      updateStage(previousStage);
      navigate(STAGE_CONFIG[previousStage].route);
    }
  };
  
  const currentConfig = STAGE_CONFIG[currentStage];
  const nextConfig = nextStage ? STAGE_CONFIG[nextStage] : null;
  const previousConfig = previousStage ? STAGE_CONFIG[previousStage] : null;
  
  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Previous Button */}
        {!hidePrevious && (
          <button
            onClick={handlePrevious}
            disabled={!previousStage || isProcessing}
            className="
              px-6 py-3 rounded-lg font-medium transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-900 dark:text-white
              flex items-center gap-2 shadow-sm hover:shadow-md
            "
          >
            <span>←</span>
            <span>
              {previousLabel || (previousConfig ? `Back to ${previousConfig.label}` : 'Back')}
            </span>
          </button>
        )}
        
        {/* Spacer for alignment when previous is hidden */}
        {hidePrevious && <div />}
        
        {/* Progress Info */}
        {showProgress && (
          <div className="text-center flex-1 px-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Stage: <span className="font-semibold text-gray-900 dark:text-white">{currentConfig.label}</span>
            </p>
            {nextConfig && !hideNext && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Next: {nextConfig.label}
              </p>
            )}
          </div>
        )}
        
        {/* Next Button */}
        {!hideNext && (
          <button
            onClick={handleNext}
            disabled={!nextStage || isProcessing}
            className="
              px-6 py-3 rounded-lg font-medium transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              text-white shadow-lg hover:shadow-xl
              flex items-center gap-2 min-w-[180px] justify-center
            "
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {nextLabel || (nextConfig ? `Continue to ${nextConfig.label}` : 'Complete Journey')}
                </span>
                <span>→</span>
              </>
            )}
          </button>
        )}
        
        {/* Spacer for alignment when next is hidden */}
        {hideNext && <div />}
      </div>
    </div>
  );
};

// Made with Bob