// Journey Wrapper Component - Wraps pages with journey context and navigation

import React, { useEffect } from 'react';
import { useJourneyStore } from '@/store/journeyStore';
import { JourneyStage } from '@/types/journey.types';
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
  hideNext?: boolean;
  hidePrevious?: boolean;
  className?: string;
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
  hideNext = false,
  hidePrevious = false,
  className = '',
}) => {
  const { updateStage, isActive } = useJourneyStore();
  
  useEffect(() => {
    // Update current stage when component mounts
    if (isActive) {
      updateStage(stage);
    }
  }, [stage, isActive, updateStage]);
  
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Progress Bar */}
      {showProgress && <JourneyProgressBar />}
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {/* Navigation */}
      {showNavigation && (
        <ContextualNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          nextLabel={nextLabel}
          previousLabel={previousLabel}
          showProgress={showProgress}
          hideNext={hideNext}
          hidePrevious={hidePrevious}
        />
      )}
    </div>
  );
};

// Made with Bob