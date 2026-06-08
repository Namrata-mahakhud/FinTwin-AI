// Simulation API Service

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Simulation,
  SimulationResults,
  RunSimulationRequest,
  SimulationProgress,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const simulationApi = {
  /**
   * Get all simulations
   */
  getAll: async (pagination?: PaginationParams): Promise<PaginatedResponse<Simulation>> => {
    const response = await apiClient.get<PaginatedResponse<Simulation>>(
      API_ENDPOINTS.SIMULATIONS.LIST,
      { params: pagination }
    );
    return response.data;
  },

  /**
   * Get simulation by ID
   */
  getById: async (id: string): Promise<Simulation> => {
    const response = await apiClient.get<Simulation>(API_ENDPOINTS.SIMULATIONS.GET(id));
    return response.data;
  },

  /**
   * Run new simulation
   */
  run: async (data: RunSimulationRequest): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>(API_ENDPOINTS.SIMULATIONS.CREATE, data);
    return response.data;
  },

  /**
   * Cancel running simulation
   */
  cancel: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.SIMULATIONS.CANCEL(id));
  },

  /**
   * Get simulation results
   */
  getResults: async (id: string): Promise<SimulationResults> => {
    const response = await apiClient.get<SimulationResults>(API_ENDPOINTS.SIMULATIONS.RESULTS(id));
    return response.data;
  },

  /**
   * Get simulation progress
   */
  getProgress: async (id: string): Promise<SimulationProgress> => {
    const response = await apiClient.get<SimulationProgress>(
      API_ENDPOINTS.SIMULATIONS.PROGRESS(id)
    );
    return response.data;
  },
};

export default simulationApi;

// Made with Bob
