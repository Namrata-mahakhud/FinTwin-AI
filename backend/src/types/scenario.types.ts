/**
 * Scenario Service Types
 */

export enum ScenarioType {
  MARKET_CRASH = 'market_crash',
  BULL_MARKET = 'bull_market',
  RECESSION = 'recession',
  INFLATION = 'inflation',
  CUSTOM = 'custom',
}

export enum ScenarioStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface ScenarioParameters {
  marketVolatility?: number; // 0-100
  interestRateChange?: number; // -10 to 10
  inflationRate?: number; // 0-20
  gdpGrowth?: number; // -10 to 10
  customFactors?: Record<string, any>;
}

export interface CreateScenarioDTO {
  name: string;
  description?: string;
  type: ScenarioType;
  parameters: ScenarioParameters;
  duration: number; // days
  startDate?: Date;
}

export interface UpdateScenarioDTO {
  name?: string;
  description?: string;
  type?: ScenarioType;
  parameters?: ScenarioParameters;
  duration?: number;
  startDate?: Date;
  status?: ScenarioStatus;
}

export interface ScenarioDocument {
  _id: string;
  name: string;
  description?: string;
  type: ScenarioType;
  parameters: ScenarioParameters;
  duration: number;
  startDate: Date;
  status: ScenarioStatus;
  simulations: string[]; // simulation IDs
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulateScenarioDTO {
  portfolioId: string;
  iterations?: number; // default 1000, max 10000
}

export interface ScenarioFilters {
  type?: ScenarioType;
  status?: ScenarioStatus;
  search?: string;
  createdBy?: string;
}

// Made with Bob
