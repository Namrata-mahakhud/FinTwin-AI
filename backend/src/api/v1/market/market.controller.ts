/**
 * Market Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { MarketService } from '../../../services/market.service';
import { MarketDataQuery, MarketSimulationParams } from '../../../types/market.types';
import { ResponseFormatter } from '../../../utils/helpers.util';
import { asyncHandler } from '../../../middleware/error.middleware';

export class MarketController {
  constructor(private service: MarketService) {}

  getMarketData = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { symbols, period, interval } = request.query as any;

    const query: MarketDataQuery = {
      symbols: symbols.split(','),
      period,
      interval,
    };

    const data = await this.service.getMarketData(query);
    return reply.send(ResponseFormatter.success(data));
  });

  getIndicators = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { symbols } = request.query as any;
    const symbolArray = symbols.split(',');

    const data = await this.service.getTechnicalIndicators(symbolArray);
    return reply.send(ResponseFormatter.success(data));
  });

  simulateMarket = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.body as MarketSimulationParams;

    const result = await this.service.simulateMarket(params);
    return reply.send(ResponseFormatter.success(result));
  });

  getVolatility = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { period } = request.query as any;

    const data = await this.service.getVolatility(period);
    return reply.send(ResponseFormatter.success(data));
  });
}

// Made with Bob
