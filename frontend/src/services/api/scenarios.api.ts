// Scenarios API Service

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Scenario,
  CreateScenarioRequest,
  UpdateScenarioRequest,
  ScenarioListFilters,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const scenariosApi = {
  /**
   * Get all scenarios with optional filters
   */
  getAll: async (
    filters?: ScenarioListFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Scenario>> => {
    const response = await apiClient.get<PaginatedResponse<Scenario>>(
      API_ENDPOINTS.SCENARIOS.LIST,
      {
        params: { ...filters, ...pagination },
      }
    );
    return response.data;
  },

  /**
   * Get scenario by ID
   */
  getById: async (id: string): Promise<Scenario> => {
    const response = await apiClient.get<Scenario>(API_ENDPOINTS.SCENARIOS.GET(id));
    return response.data;
  },

  /**
   * Create new scenario
   */
  create: async (data: CreateScenarioRequest): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>(API_ENDPOINTS.SCENARIOS.CREATE, data);
    return response.data;
  },

  /**
   * Update scenario
   */
  update: async (id: string, data: UpdateScenarioRequest): Promise<Scenario> => {
    const response = await apiClient.put<Scenario>(API_ENDPOINTS.SCENARIOS.UPDATE(id), data);
    return response.data;
  },

  /**
   * Delete scenario
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SCENARIOS.DELETE(id));
  },

  /**
   * Duplicate scenario
   */
  duplicate: async (id: string): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>(API_ENDPOINTS.SCENARIOS.DUPLICATE(id));
    return response.data;
  },
};

export default scenariosApi;

// Made with Bob
