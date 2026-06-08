// Simulation and Results Types

export interface Simulation {
  id: string;
  name: string;
  scenarioId: string;
  portfolioId: string;
  status: SimulationStatus;
  progress: number; // 0-100
  startedAt: string;
  completedAt?: string;
  duration?: number; // in seconds
  results?: SimulationResults;
  error?: string;
}

export enum SimulationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface SimulationResults {
  simulationId: string;
  scenarioId: string;
  portfolioId: string;
  summary: SimulationSummary;
  projections: PortfolioProjection[];
  riskAnalysis: RiskAnalysis;
  impactByAsset: AssetImpact[];
  impactBySector: SectorImpact[];
  correlationMatrix: CorrelationMatrix;
  recommendations: Recommendation[];
  timestamp: string;
}

export interface SimulationSummary {
  expectedReturn: number;
  expectedLoss: number;
  bestCase: number;
  worstCase: number;
  probabilityOfLoss: number;
  timeToRecovery?: number; // in days
  confidenceLevel: number; // 0-100
}

export interface PortfolioProjection {
  date: string;
  value: number;
  percentChange: number;
  volatility: number;
  confidence: {
    lower: number; // 5th percentile
    upper: number; // 95th percentile
  };
}

export interface RiskAnalysis {
  overallRisk: RiskLevel;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  heatmap: HeatmapData;
  stressTestResults: StressTestResult[];
}

export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export interface RiskFactor {
  name: string;
  category: string;
  severity: RiskLevel;
  impact: number; // -100 to 100
  probability: number; // 0-100
  description: string;
}

export interface HeatmapData {
  rows: string[]; // asset names or sectors
  columns: string[]; // time periods or scenarios
  values: number[][]; // risk values
  colorScale: {
    min: number;
    max: number;
    colors: string[];
  };
}

export interface StressTestResult {
  scenario: string;
  portfolioImpact: number;
  recoveryTime: number;
  affectedAssets: string[];
}

export interface AssetImpact {
  assetId: string;
  symbol: string;
  name: string;
  currentValue: number;
  projectedValue: number;
  percentChange: number;
  riskContribution: number;
  recommendation: string;
}

export interface SectorImpact {
  sector: string;
  currentValue: number;
  projectedValue: number;
  percentChange: number;
  riskLevel: RiskLevel;
  affectedAssets: number;
}

export interface CorrelationMatrix {
  assets: string[];
  matrix: number[][]; // correlation coefficients -1 to 1
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  action: string;
  expectedImpact: number;
  confidence: number; // 0-100
  reasoning: string[];
  relatedAssets?: string[];
}

export enum RecommendationType {
  REBALANCE = 'rebalance',
  HEDGE = 'hedge',
  REDUCE_EXPOSURE = 'reduce_exposure',
  INCREASE_EXPOSURE = 'increase_exposure',
  DIVERSIFY = 'diversify',
  LIQUIDATE = 'liquidate',
  HOLD = 'hold',
}

export enum RecommendationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface RunSimulationRequest {
  scenarioId: string;
  portfolioId: string;
  name?: string;
  parameters?: SimulationParameters;
}

export interface SimulationParameters {
  timeHorizon?: number; // in days
  iterations?: number; // Monte Carlo iterations
  confidenceLevel?: number; // 0-100
  includeStressTests?: boolean;
  customEvents?: any[];
}

export interface SimulationProgress {
  simulationId: string;
  status: SimulationStatus;
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: number; // in seconds
}

// Made with Bob
