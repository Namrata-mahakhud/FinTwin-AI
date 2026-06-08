// Application Routes

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected Routes
  DASHBOARD: '/dashboard',
  
  // Scenarios
  SCENARIOS: '/scenarios',
  SCENARIOS_NEW: '/scenarios/new',
  SCENARIOS_DETAIL: '/scenarios/:id',
  SCENARIOS_EDIT: '/scenarios/:id/edit',
  
  // Portfolio
  PORTFOLIO: '/portfolio',
  PORTFOLIO_ANALYSIS: '/portfolio/analysis',
  
  // Risk
  RISK_HEATMAP: '/risk-heatmap',
  
  // Simulations
  SIMULATIONS: '/simulations',
  SIMULATIONS_DETAIL: '/simulations/:id',
  SIMULATIONS_NEW: '/simulations/new',
  SIMULATIONS_JOURNEY: '/simulations/:id/journey',
  SIMULATIONS_WAR_ROOM: '/simulations/:id/war-room',
  
  // Journey-based Routes
  JOURNEY_CREATE_SCENARIO: '/journey/create-scenario',
  JOURNEY_RUN_SIMULATION: '/journey/run-simulation',
  JOURNEY_CRISIS_CENTER: '/journey/crisis-center',
  JOURNEY_PORTFOLIO_IMPACT: '/journey/portfolio-impact',
  JOURNEY_RISK_HEATMAP: '/journey/risk-heatmap',
  JOURNEY_AI_RECOMMENDATIONS: '/journey/ai-recommendations',
  JOURNEY_RECOVERY: '/journey/recovery',
  JOURNEY_AGENT_STUDIO: '/journey/agent-studio',
  JOURNEY_EXPORT: '/journey/export',
  
  // Recommendations
  RECOMMENDATIONS: '/recommendations',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOGS: '/admin/logs',
  
  // User
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Helper function to build route with params
export const buildRoute = (route: string, params: Record<string, string | number>): string => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  return path;
};

// Route metadata
export interface RouteMetadata {
  path: string;
  title: string;
  requiresAuth: boolean;
  requiredRoles?: string[];
  icon?: string;
  showInNav?: boolean;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    requiresAuth: true,
    icon: 'dashboard',
    showInNav: true,
  },
  [ROUTES.SCENARIOS]: {
    path: ROUTES.SCENARIOS,
    title: 'Scenarios',
    requiresAuth: true,
    icon: 'scenarios',
    showInNav: true,
  },
  [ROUTES.PORTFOLIO]: {
    path: ROUTES.PORTFOLIO,
    title: 'Portfolio',
    requiresAuth: true,
    icon: 'portfolio',
    showInNav: true,
  },
  [ROUTES.RISK_HEATMAP]: {
    path: ROUTES.RISK_HEATMAP,
    title: 'Risk Heatmap',
    requiresAuth: true,
    icon: 'heatmap',
    showInNav: true,
  },
  [ROUTES.SIMULATIONS]: {
    path: ROUTES.SIMULATIONS,
    title: 'Simulations',
    requiresAuth: true,
    icon: 'simulations',
    showInNav: true,
  },
  [ROUTES.RECOMMENDATIONS]: {
    path: ROUTES.RECOMMENDATIONS,
    title: 'Recommendations',
    requiresAuth: true,
    icon: 'recommendations',
    showInNav: true,
  },
  [ROUTES.ADMIN]: {
    path: ROUTES.ADMIN,
    title: 'Admin',
    requiresAuth: true,
    requiredRoles: ['admin'],
    icon: 'admin',
    showInNav: true,
  },
};

// Made with Bob
