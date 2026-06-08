// Journey Type Definitions

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

export interface JourneyData {
  scenarioId?: string;
  simulationId?: string;
  scenario?: any;
  simulationResults?: any;
  recommendations?: any[];
  appliedActions?: string[];
  recoveryData?: any;
  agentConfig?: any;
}

export interface JourneyState {
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

export interface StageConfig {
  label: string;
  icon: string;
  route: string;
  description?: string;
}

export const STAGE_CONFIG: Record<JourneyStage, StageConfig> = {
  [JourneyStage.DASHBOARD]: {
    label: 'Dashboard',
    icon: '🏠',
    route: '/dashboard',
    description: 'Portfolio overview and journey start',
  },
  [JourneyStage.CREATE_SCENARIO]: {
    label: 'Create',
    icon: '📝',
    route: '/scenarios/new',
    description: 'Configure market shock scenario',
  },
  [JourneyStage.RUN_SIMULATION]: {
    label: 'Simulate',
    icon: '⚡',
    route: '/simulations/run',
    description: 'Execute simulation',
  },
  [JourneyStage.CRISIS_CENTER]: {
    label: 'War Room',
    icon: '🎯',
    route: '/war-room',
    description: 'Real-time crisis monitoring',
  },
  [JourneyStage.PORTFOLIO_IMPACT]: {
    label: 'Impact',
    icon: '💼',
    route: '/portfolio/impact',
    description: 'Analyze portfolio impact',
  },
  [JourneyStage.RISK_HEATMAP]: {
    label: 'Risk',
    icon: '🔥',
    route: '/risk-heatmap',
    description: 'Visual risk analysis',
  },
  [JourneyStage.AI_RECOMMENDATIONS]: {
    label: 'AI Insights',
    icon: '🤖',
    route: '/recommendations',
    description: 'AI-powered recommendations',
  },
  [JourneyStage.RECOVERY_SIMULATION]: {
    label: 'Recovery',
    icon: '🔄',
    route: '/recovery',
    description: 'Test recovery strategies',
  },
  [JourneyStage.AGENT_STUDIO]: {
    label: 'Agents',
    icon: '⚙️',
    route: '/agent-studio',
    description: 'Configure AI agents',
  },
  [JourneyStage.EXPORT_REPORT]: {
    label: 'Export',
    icon: '📊',
    route: '/export',
    description: 'Generate and export report',
  },
};

// Made with Bob
