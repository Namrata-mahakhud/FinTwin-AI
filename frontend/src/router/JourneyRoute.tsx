// Journey Route Guard
// Ensures users follow the journey flow and have completed prerequisite stages

import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '@/store/journeyStore';
import { JourneyStage } from '@/types/journey.types';
import { ROUTES } from '@/constants/routes';

interface JourneyRouteProps {
  children: ReactNode;
  requiredStage: JourneyStage;
  redirectTo?: string;
}

/**
 * Journey Route Guard Component
 *
 * Validates that:
 * 1. Journey is active
 * 2. User has completed prerequisite stages
 * 3. Current stage matches or is ahead of required stage
 *
 * If validation fails, redirects to appropriate stage or dashboard
 */
export const JourneyRoute = ({
  children,
  requiredStage,
  redirectTo = ROUTES.DASHBOARD,
}: JourneyRouteProps) => {
  const navigate = useNavigate();
  const { isActive, currentStage, completedStages, canNavigateTo } = useJourneyStore();

  useEffect(() => {
    // If journey is not active, redirect to dashboard
    if (!isActive) {
      console.warn('Journey not active, redirecting to dashboard');
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check if user can navigate to this stage
    if (!canNavigateTo(requiredStage)) {
      console.warn(`Cannot navigate to stage ${requiredStage}, redirecting`);

      // Find the last completed stage or current stage
      const lastStage =
        completedStages.length > 0 ? completedStages[completedStages.length - 1] : currentStage;

      // Redirect to the appropriate stage
      const stageRouteMap: Record<JourneyStage, string> = {
        [JourneyStage.DASHBOARD]: ROUTES.DASHBOARD,
        [JourneyStage.CREATE_SCENARIO]: ROUTES.JOURNEY_CREATE_SCENARIO,
        [JourneyStage.RUN_SIMULATION]: ROUTES.JOURNEY_RUN_SIMULATION,
        [JourneyStage.CRISIS_CENTER]: ROUTES.JOURNEY_CRISIS_CENTER,
        [JourneyStage.PORTFOLIO_IMPACT]: ROUTES.JOURNEY_PORTFOLIO_IMPACT,
        [JourneyStage.RISK_HEATMAP]: ROUTES.JOURNEY_RISK_HEATMAP,
        [JourneyStage.AI_RECOMMENDATIONS]: ROUTES.JOURNEY_AI_RECOMMENDATIONS,
        [JourneyStage.RECOVERY_SIMULATION]: ROUTES.JOURNEY_RECOVERY,
        [JourneyStage.AGENT_STUDIO]: ROUTES.JOURNEY_AGENT_STUDIO,
        [JourneyStage.EXPORT_REPORT]: ROUTES.JOURNEY_EXPORT,
      };

      navigate(stageRouteMap[lastStage] || ROUTES.DASHBOARD, { replace: true });
    }
  }, [isActive, currentStage, completedStages, requiredStage, navigate, redirectTo, canNavigateTo]);

  // Only render children if journey is active and stage is accessible
  if (!isActive || !canNavigateTo(requiredStage)) {
    return null;
  }

  return <>{children}</>;
};

export default JourneyRoute;

// Made with Bob
