import { UserRole } from '../models/user.model';

// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    defaultCurrency?: string;
  };
}

// Response types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  token: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLogin?: Date;
  preferences: {
    theme: string;
    notifications: boolean;
    defaultCurrency: string;
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Fastify Request with user
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

// API Error
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Simulation Types
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
  timeToRecovery: number;
  confidenceLevel: number;
}

export interface PortfolioProjection {
  date: string;
  value: number;
  percentChange: number;
  volatility: number;
  confidence: {
    lower: number;
    upper: number;
  };
}

export interface RiskAnalysis {
  overallRisk: string;
  riskScore: number;
  riskFactors: RiskFactor[];
  heatmap: RiskHeatmap;
  stressTestResults: any[];
}

export interface RiskFactor {
  name: string;
  category: string;
  severity: string;
  impact: number;
  probability: number;
  description: string;
}

export interface RiskHeatmap {
  rows: string[];
  columns: string[];
  values: number[][];
  colorScale: {
    min: number;
    max: number;
    colors: string[];
  };
}

export interface AssetImpact {
  assetId: string;
  assetName: string;
  currentValue: number;
  projectedValue: number;
  percentChange: number;
  riskLevel: string;
}

export interface SectorImpact {
  sector: string;
  currentValue: number;
  projectedValue: number;
  percentChange: number;
  riskLevel: string;
  affectedAssets: number;
}

export interface CorrelationMatrix {
  assets: string[];
  matrix: number[][];
}

export interface Recommendation {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  action: string;
  expectedImpact: number;
  confidence: number;
  reasoning: string[];
}

// Made with Bob
