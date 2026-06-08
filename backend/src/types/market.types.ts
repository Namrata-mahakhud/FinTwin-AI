/**
 * Market Engine Types
 */

export interface MarketDataQuery {
  symbols: string[];
  period: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' | '5y';
  interval?: '1m' | '5m' | '15m' | '1h' | '1d';
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  historicalData: HistoricalDataPoint[];
}

export interface TechnicalIndicators {
  symbol: string;
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    movingAverages: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
}

export interface MarketSimulationParams {
  scenarioId: string;
  symbols: string[];
  startDate: Date;
  endDate: Date;
  parameters: {
    volatility: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    correlations?: Record<string, number>;
  };
}

export interface PriceProjection {
  date: string;
  projectedPrice: number;
  confidence: number;
  range: {
    low: number;
    high: number;
  };
}

export interface MarketSimulationResult {
  simulationId: string;
  projections: Record<string, PriceProjection[]>;
}

export interface VolatilityMetrics {
  overall: {
    vix: number;
    historicalVolatility: number;
    impliedVolatility: number;
  };
  sectors: Record<string, number>;
}

// Made with Bob
