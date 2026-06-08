/**
 * Market Engine Service
 */

import {
  MarketDataQuery,
  MarketData,
  TechnicalIndicators,
  MarketSimulationParams,
  MarketSimulationResult,
  VolatilityMetrics,
  HistoricalDataPoint,
  PriceProjection,
} from '../types/market.types';
import { ValidationError, ExternalServiceError } from '../utils/errors.util';
import { DateUtils, NumberUtils, ArrayUtils } from '../utils/helpers.util';

export class MarketService {
  /**
   * Get market data for symbols
   */
  async getMarketData(query: MarketDataQuery): Promise<Record<string, MarketData>> {
    this.validateMarketDataQuery(query);

    const result: Record<string, MarketData> = {};

    for (const symbol of query.symbols) {
      // TODO: Integrate with real market data API (Alpha Vantage, Yahoo Finance, etc.)
      // For now, generate mock data
      result[symbol] = await this.fetchMarketData(symbol, query.period);
    }

    return result;
  }

  /**
   * Get technical indicators for symbols
   */
  async getTechnicalIndicators(symbols: string[]): Promise<Record<string, TechnicalIndicators>> {
    if (!symbols || symbols.length === 0) {
      throw new ValidationError('At least one symbol is required');
    }

    const result: Record<string, TechnicalIndicators> = {};

    for (const symbol of symbols) {
      const historicalData = await this.getHistoricalPrices(symbol, 200);
      result[symbol] = this.calculateIndicators(symbol, historicalData);
    }

    return result;
  }

  /**
   * Simulate market conditions
   */
  async simulateMarket(params: MarketSimulationParams): Promise<MarketSimulationResult> {
    this.validateSimulationParams(params);

    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projections: Record<string, PriceProjection[]> = {};

    for (const symbol of params.symbols) {
      projections[symbol] = await this.generateProjections(
        symbol,
        params.startDate,
        params.endDate,
        params.parameters
      );
    }

    return {
      simulationId,
      projections,
    };
  }

  /**
   * Get market volatility metrics
   */
  async getVolatility(period: string = '30d'): Promise<VolatilityMetrics> {
    // TODO: Integrate with real volatility data
    // For now, generate mock data
    return {
      overall: {
        vix: NumberUtils.randomInRange(10, 30),
        historicalVolatility: NumberUtils.randomInRange(15, 35),
        impliedVolatility: NumberUtils.randomInRange(18, 32),
      },
      sectors: {
        technology: NumberUtils.randomInRange(20, 30),
        finance: NumberUtils.randomInRange(15, 25),
        healthcare: NumberUtils.randomInRange(12, 22),
        energy: NumberUtils.randomInRange(25, 35),
        consumer: NumberUtils.randomInRange(15, 25),
      },
    };
  }

  /**
   * Fetch market data for a symbol (mock implementation)
   */
  private async fetchMarketData(symbol: string, period: string): Promise<MarketData> {
    // Generate mock historical data
    const { startDate, endDate } = DateUtils.getDateRange(period);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const historicalData: HistoricalDataPoint[] = [];
    let currentPrice = NumberUtils.randomInRange(50, 500);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility;
      
      const open = currentPrice;
      const close = currentPrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(NumberUtils.randomInRange(1000000, 10000000));

      historicalData.push({
        date: date.toISOString().split('T')[0],
        open: NumberUtils.round(open, 2),
        high: NumberUtils.round(high, 2),
        low: NumberUtils.round(low, 2),
        close: NumberUtils.round(close, 2),
        volume,
      });

      currentPrice = close;
    }

    const firstPrice = historicalData[0].close;
    const lastPrice = historicalData[historicalData.length - 1].close;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    return {
      symbol,
      name: `${symbol} Inc.`,
      currentPrice: NumberUtils.round(lastPrice, 2),
      change: NumberUtils.round(change, 2),
      changePercent: NumberUtils.round(changePercent, 2),
      volume: historicalData[historicalData.length - 1].volume,
      marketCap: NumberUtils.round(lastPrice * 1000000000, 0),
      historicalData,
    };
  }

  /**
   * Get historical prices for technical analysis
   */
  private async getHistoricalPrices(symbol: string, days: number): Promise<number[]> {
    const marketData = await this.fetchMarketData(symbol, `${days}d`);
    return marketData.historicalData.map(d => d.close);
  }

  /**
   * Calculate technical indicators
   */
  private calculateIndicators(symbol: string, prices: number[]): TechnicalIndicators {
    return {
      symbol,
      indicators: {
        rsi: this.calculateRSI(prices, 14),
        macd: this.calculateMACD(prices),
        movingAverages: {
          sma20: this.calculateSMA(prices, 20),
          sma50: this.calculateSMA(prices, 50),
          sma200: this.calculateSMA(prices, 200),
        },
        bollingerBands: this.calculateBollingerBands(prices, 20, 2),
      },
    };
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const gains = changes.map(c => (c > 0 ? c : 0));
    const losses = changes.map(c => (c < 0 ? Math.abs(c) : 0));

    const avgGain = ArrayUtils.average(gains.slice(-period));
    const avgLoss = ArrayUtils.average(losses.slice(-period));

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return NumberUtils.round(rsi, 2);
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  private calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;

    // For signal line, we'd need to calculate EMA of MACD line
    // Simplified version:
    const signalLine = macdLine * 0.9;
    const histogram = macdLine - signalLine;

    return {
      value: NumberUtils.round(macdLine, 2),
      signal: NumberUtils.round(signalLine, 2),
      histogram: NumberUtils.round(histogram, 2),
    };
  }

  /**
   * Calculate SMA (Simple Moving Average)
   */
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];

    const relevantPrices = prices.slice(-period);
    return NumberUtils.round(ArrayUtils.average(relevantPrices), 2);
  }

  /**
   * Calculate EMA (Exponential Moving Average)
   */
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];

    const multiplier = 2 / (period + 1);
    let ema = ArrayUtils.average(prices.slice(0, period));

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  /**
   * Calculate Bollinger Bands
   */
  private calculateBollingerBands(
    prices: number[],
    period: number,
    stdDev: number
  ): { upper: number; middle: number; lower: number } {
    const middle = this.calculateSMA(prices, period);
    const relevantPrices = prices.slice(-period);
    const standardDeviation = ArrayUtils.standardDeviation(relevantPrices);

    return {
      upper: NumberUtils.round(middle + stdDev * standardDeviation, 2),
      middle: NumberUtils.round(middle, 2),
      lower: NumberUtils.round(middle - stdDev * standardDeviation, 2),
    };
  }

  /**
   * Generate price projections using Monte Carlo simulation
   */
  private async generateProjections(
    symbol: string,
    startDate: Date,
    endDate: Date,
    parameters: any
  ): Promise<PriceProjection[]> {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentPrice = NumberUtils.randomInRange(50, 500);
    const projections: PriceProjection[] = [];

    // Base volatility from parameters
    const baseVolatility = parameters.volatility / 100;
    
    // Trend adjustment
    const trendAdjustment =
      parameters.trend === 'bullish' ? 0.001 : parameters.trend === 'bearish' ? -0.001 : 0;

    let price = currentPrice;

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Monte Carlo simulation (simplified)
      const randomShock = (Math.random() - 0.5) * 2 * baseVolatility;
      price = price * (1 + trendAdjustment + randomShock);

      // Calculate confidence interval
      const confidence = Math.max(0.5, 1 - i / days * 0.5);
      const range = price * baseVolatility * Math.sqrt(i + 1);

      projections.push({
        date: date.toISOString().split('T')[0],
        projectedPrice: NumberUtils.round(price, 2),
        confidence: NumberUtils.round(confidence, 2),
        range: {
          low: NumberUtils.round(price - range, 2),
          high: NumberUtils.round(price + range, 2),
        },
      });
    }

    return projections;
  }

  /**
   * Validate market data query
   */
  private validateMarketDataQuery(query: MarketDataQuery): void {
    if (!query.symbols || query.symbols.length === 0) {
      throw new ValidationError('At least one symbol is required');
    }

    if (query.symbols.length > 10) {
      throw new ValidationError('Maximum 10 symbols allowed per request');
    }

    const validPeriods = ['1d', '5d', '1m', '3m', '6m', '1y', '5y'];
    if (!validPeriods.includes(query.period)) {
      throw new ValidationError(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
    }

    if (query.interval) {
      const validIntervals = ['1m', '5m', '15m', '1h', '1d'];
      if (!validIntervals.includes(query.interval)) {
        throw new ValidationError(`Invalid interval. Must be one of: ${validIntervals.join(', ')}`);
      }
    }
  }

  /**
   * Validate simulation parameters
   */
  private validateSimulationParams(params: MarketSimulationParams): void {
    if (!params.symbols || params.symbols.length === 0) {
      throw new ValidationError('At least one symbol is required');
    }

    if (!params.startDate || !params.endDate) {
      throw new ValidationError('Start date and end date are required');
    }

    if (params.startDate >= params.endDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (!params.parameters.volatility || params.parameters.volatility < 0 || params.parameters.volatility > 100) {
      throw new ValidationError('Volatility must be between 0 and 100');
    }

    const validTrends = ['bullish', 'bearish', 'neutral'];
    if (!validTrends.includes(params.parameters.trend)) {
      throw new ValidationError(`Trend must be one of: ${validTrends.join(', ')}`);
    }
  }
}

// Made with Bob
