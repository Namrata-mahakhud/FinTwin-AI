// Application Configuration

export const APP_CONFIG = {
  NAME: 'FinTwin AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Autonomous Financial Digital Twin for Market Shock Simulation',
  AUTHOR: 'FinTwin AI Team',
};

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const CHART_CONFIG = {
  DEFAULT_COLORS: [
    '#667eea', // primary
    '#764ba2', // secondary
    '#f093fb', // accent
    '#4facfe', // info
    '#43e97b', // success
    '#fa709a', // warning
    '#ff6b6b', // error
  ],
  ANIMATION_DURATION: 300,
  TOOLTIP_DELAY: 100,
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  TIME_ONLY: 'HH:mm',
};

export const CURRENCY_CONFIG = {
  DEFAULT: 'USD',
  SUPPORTED: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'],
  DECIMAL_PLACES: 2,
};

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  SCENARIO: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
  PORTFOLIO: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    MIN_HOLDINGS: 1,
    MAX_HOLDINGS: 100,
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fintwin_auth_token',
  REFRESH_TOKEN: 'fintwin_refresh_token',
  USER: 'fintwin_user',
  THEME: 'fintwin_theme',
  LANGUAGE: 'fintwin_language',
  SIDEBAR_COLLAPSED: 'fintwin_sidebar_collapsed',
  RECENT_SCENARIOS: 'fintwin_recent_scenarios',
  RECENT_PORTFOLIOS: 'fintwin_recent_portfolios',
};

export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
  POSITION: 'top-right' as const,
  MAX_TOASTS: 3,
};

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
  SCROLL: 100,
};

export const SIMULATION_CONFIG = {
  DEFAULT_ITERATIONS: 10000,
  DEFAULT_TIME_HORIZON: 365, // days
  DEFAULT_CONFIDENCE_LEVEL: 95,
  MAX_ITERATIONS: 100000,
  MIN_ITERATIONS: 1000,
  PROGRESS_UPDATE_INTERVAL: 1000, // ms
};

export const RISK_LEVELS = {
  VERY_LOW: { min: 0, max: 20, color: '#43e97b', label: 'Very Low' },
  LOW: { min: 20, max: 40, color: '#4facfe', label: 'Low' },
  MODERATE: { min: 40, max: 60, color: '#f093fb', label: 'Moderate' },
  HIGH: { min: 60, max: 80, color: '#fa709a', label: 'High' },
  VERY_HIGH: { min: 80, max: 100, color: '#ff6b6b', label: 'Very High' },
};

export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_WEBSOCKETS: true,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true,
  ENABLE_COLLABORATION: false,
};

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/json',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.json', '.csv', '.xls', '.xlsx'],
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Made with Bob
