// Portfolio API Service

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Portfolio,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  AddHoldingRequest,
  UpdateHoldingRequest,
  PortfolioAnalysis,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const portfolioApi = {
  /**
   * Get all portfolios
   */
  getAll: async (pagination?: PaginationParams): Promise<PaginatedResponse<Portfolio>> => {
    const response = await apiClient.get<PaginatedResponse<Portfolio>>(
      API_ENDPOINTS.PORTFOLIO.LIST,
      { params: pagination }
    );
    return response.data;
  },

  /**
   * Get portfolio by ID
   */
  getById: async (id: string): Promise<Portfolio> => {
    const response = await apiClient.get<Portfolio>(API_ENDPOINTS.PORTFOLIO.GET(id));
    return response.data;
  },

  /**
   * Create new portfolio
   */
  create: async (data: CreatePortfolioRequest): Promise<Portfolio> => {
    const response = await apiClient.post<Portfolio>(API_ENDPOINTS.PORTFOLIO.CREATE, data);
    return response.data;
  },

  /**
   * Update portfolio
   */
  update: async (id: string, data: UpdatePortfolioRequest): Promise<Portfolio> => {
    const response = await apiClient.put<Portfolio>(API_ENDPOINTS.PORTFOLIO.UPDATE(id), data);
    return response.data;
  },

  /**
   * Delete portfolio
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE(id));
  },

  /**
   * Get portfolio analysis
   */
  getAnalysis: async (id: string, scenarioId?: string): Promise<PortfolioAnalysis> => {
    const response = await apiClient.get<PortfolioAnalysis>(API_ENDPOINTS.PORTFOLIO.ANALYSIS(id), {
      params: { scenarioId },
    });
    return response.data;
  },

  /**
   * Add holding to portfolio
   */
  addHolding: async (data: AddHoldingRequest): Promise<Portfolio> => {
    const response = await apiClient.post<Portfolio>(
      API_ENDPOINTS.PORTFOLIO.HOLDINGS.ADD(data.portfolioId),
      data
    );
    return response.data;
  },

  /**
   * Update holding
   */
  updateHolding: async (
    portfolioId: string,
    holdingId: string,
    data: UpdateHoldingRequest
  ): Promise<Portfolio> => {
    const response = await apiClient.put<Portfolio>(
      API_ENDPOINTS.PORTFOLIO.HOLDINGS.UPDATE(portfolioId, holdingId),
      data
    );
    return response.data;
  },

  /**
   * Delete holding
   */
  deleteHolding: async (portfolioId: string, holdingId: string): Promise<Portfolio> => {
    const response = await apiClient.delete<Portfolio>(
      API_ENDPOINTS.PORTFOLIO.HOLDINGS.DELETE(portfolioId, holdingId)
    );
    return response.data;
  },
};

export default portfolioApi;

// Made with Bob
