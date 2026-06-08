// API Configuration and Endpoints

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    REGISTER: '/v1/auth/register',
    REFRESH: '/v1/auth/refresh',
    ME: '/v1/auth/me',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
  },

  // Scenarios
  SCENARIOS: {
    LIST: '/v1/scenarios',
    CREATE: '/v1/scenarios',
    GET: (id: string) => `/v1/scenarios/${id}`,
    UPDATE: (id: string) => `/v1/scenarios/${id}`,
    DELETE: (id: string) => `/v1/scenarios/${id}`,
    DUPLICATE: (id: string) => `/v1/scenarios/${id}/duplicate`,
  },

  // Portfolio
  PORTFOLIO: {
    LIST: '/v1/portfolios',
    CREATE: '/v1/portfolios',
    GET: (id: string) => `/v1/portfolios/${id}`,
    UPDATE: (id: string) => `/v1/portfolios/${id}`,
    DELETE: (id: string) => `/v1/portfolios/${id}`,
    ANALYSIS: (id: string) => `/v1/portfolios/${id}/analysis`,
    HOLDINGS: {
      LIST: (portfolioId: string) => `/v1/portfolios/${portfolioId}/holdings`,
      ADD: (portfolioId: string) => `/v1/portfolios/${portfolioId}/holdings`,
      UPDATE: (portfolioId: string, holdingId: string) =>
        `/v1/portfolios/${portfolioId}/holdings/${holdingId}`,
      DELETE: (portfolioId: string, holdingId: string) =>
        `/v1/portfolios/${portfolioId}/holdings/${holdingId}`,
    },
  },

  // Simulations
  SIMULATIONS: {
    LIST: '/v1/simulations',
    CREATE: '/v1/simulations',
    GET: (id: string) => `/v1/simulations/${id}`,
    CANCEL: (id: string) => `/v1/simulations/${id}/cancel`,
    RESULTS: (id: string) => `/v1/simulations/${id}/results`,
    PROGRESS: (id: string) => `/v1/simulations/${id}/progress`,
  },

  // Recommendations
  RECOMMENDATIONS: {
    LIST: '/v1/recommendations',
    GET: (id: string) => `/v1/recommendations/${id}`,
    BY_SIMULATION: (simulationId: string) => `/v1/recommendations/simulation/${simulationId}`,
    ACCEPT: (id: string) => `/v1/recommendations/${id}/accept`,
    REJECT: (id: string) => `/v1/recommendations/${id}/reject`,
  },

  // Risk Analysis
  RISK: {
    HEATMAP: '/v1/risk/heatmap',
    FACTORS: '/v1/risk/factors',
    CORRELATION: '/v1/risk/correlation',
  },

  // Market Data
  MARKET: {
    ASSETS: '/v1/market/assets',
    ASSET: (symbol: string) => `/v1/market/assets/${symbol}`,
    QUOTE: (symbol: string) => `/v1/market/quote/${symbol}`,
    HISTORICAL: (symbol: string) => `/v1/market/historical/${symbol}`,
  },

  // Admin
  ADMIN: {
    USERS: {
      LIST: '/v1/admin/users',
      GET: (id: string) => `/v1/admin/users/${id}`,
      UPDATE: (id: string) => `/v1/admin/users/${id}`,
      DELETE: (id: string) => `/v1/admin/users/${id}`,
    },
    SETTINGS: '/v1/admin/settings',
    LOGS: '/v1/admin/logs',
    STATS: '/v1/admin/stats',
  },

  // Health
  HEALTH: '/health',
  VERSION: '/version',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  SIMULATION_PROGRESS: 'simulation:progress',
  SIMULATION_COMPLETE: 'simulation:complete',
  SIMULATION_ERROR: 'simulation:error',
  MARKET_UPDATE: 'market:update',
  NOTIFICATION: 'notification',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Made with Bob
