// Portfolio and Asset Types

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  currency: string;
  holdings: Holding[];
  performance: PortfolioPerformance;
  riskMetrics: RiskMetrics;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Holding {
  id: string;
  assetId: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  weight: number; // percentage of portfolio
  sector?: string;
  region?: string;
}

export enum AssetType {
  STOCK = 'stock',
  BOND = 'bond',
  ETF = 'etf',
  MUTUAL_FUND = 'mutual_fund',
  COMMODITY = 'commodity',
  CRYPTO = 'crypto',
  CASH = 'cash',
  REAL_ESTATE = 'real_estate',
  ALTERNATIVE = 'alternative',
}

export interface PortfolioPerformance {
  totalReturn: number; // percentage
  totalReturnAmount: number;
  dayChange: number;
  dayChangeAmount: number;
  weekChange: number;
  monthChange: number;
  yearChange: number;
  inceptionReturn: number;
  historicalReturns: HistoricalReturn[];
}

export interface HistoricalReturn {
  date: string;
  value: number;
  return: number;
}

export interface RiskMetrics {
  volatility: number; // annualized standard deviation
  sharpeRatio: number;
  beta: number;
  alpha: number;
  maxDrawdown: number;
  valueAtRisk: number; // VaR 95%
  conditionalVaR: number; // CVaR
  diversificationRatio: number;
}

export interface AssetAllocation {
  byAssetType: AllocationBreakdown[];
  bySector: AllocationBreakdown[];
  byRegion: AllocationBreakdown[];
}

export interface AllocationBreakdown {
  category: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface PortfolioAnalysis {
  portfolioId: string;
  scenarioId?: string;
  allocation: AssetAllocation;
  riskMetrics: RiskMetrics;
  performance: PortfolioPerformance;
  recommendations: string[];
  timestamp: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  currency: string;
  holdings: Omit<Holding, 'id' | 'totalValue' | 'weight'>[];
}

export interface UpdatePortfolioRequest extends Partial<CreatePortfolioRequest> {
  holdings?: Holding[];
}

export interface AddHoldingRequest {
  portfolioId: string;
  assetId: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  sector?: string;
  region?: string;
}

export interface UpdateHoldingRequest {
  quantity?: number;
  averagePrice?: number;
}

// Made with Bob
