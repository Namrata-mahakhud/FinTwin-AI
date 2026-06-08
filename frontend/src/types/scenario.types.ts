// Scenario and Economic Event Types

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  severity: SeveritLevel;
  events: EconomicEvent[];
  status: ScenarioStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export enum ScenarioType {
  MARKET_CRASH = 'market_crash',
  INTEREST_RATE_CHANGE = 'interest_rate_change',
  INFLATION_SHOCK = 'inflation_shock',
  GEOPOLITICAL_EVENT = 'geopolitical_event',
  RECESSION = 'recession',
  CURRENCY_CRISIS = 'currency_crisis',
  COMMODITY_SHOCK = 'commodity_shock',
  CUSTOM = 'custom',
}

export enum SeveritLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ScenarioStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface EconomicEvent {
  id: string;
  type: EventType;
  description: string;
  impact: EventImpact;
  probability: number; // 0-100
  timeframe: Timeframe;
  parameters: EventParameters;
}

export enum EventType {
  INTEREST_RATE = 'interest_rate',
  INFLATION = 'inflation',
  GDP_CHANGE = 'gdp_change',
  UNEMPLOYMENT = 'unemployment',
  MARKET_VOLATILITY = 'market_volatility',
  CURRENCY_FLUCTUATION = 'currency_fluctuation',
  COMMODITY_PRICE = 'commodity_price',
  REGULATORY_CHANGE = 'regulatory_change',
}

export interface EventImpact {
  markets: string[]; // e.g., ['equity', 'bond', 'commodity']
  sectors: string[]; // e.g., ['technology', 'finance', 'energy']
  magnitude: number; // -100 to 100
}

export interface Timeframe {
  start: string; // ISO date
  end: string; // ISO date
  duration: number; // in days
}

export interface EventParameters {
  [key: string]: number | string | boolean;
  // Examples:
  // interestRateChange?: number;
  // inflationRate?: number;
  // marketDropPercentage?: number;
}

export interface CreateScenarioRequest {
  name: string;
  description: string;
  type: ScenarioType;
  severity: SeveritLevel;
  events: Omit<EconomicEvent, 'id'>[];
  tags?: string[];
}

export interface UpdateScenarioRequest extends Partial<CreateScenarioRequest> {
  status?: ScenarioStatus;
}

export interface ScenarioListFilters {
  type?: ScenarioType;
  severity?: SeveritLevel;
  status?: ScenarioStatus;
  search?: string;
  tags?: string[];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Made with Bob
