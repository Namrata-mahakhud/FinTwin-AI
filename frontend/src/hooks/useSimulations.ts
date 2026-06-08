// React Query Hooks for Simulations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationApi } from '@/services/api/simulation.api';
import { toast } from '@/store/toastStore';
import { SimulationStatus } from '@/types';
import type { RunSimulationRequest, Simulation } from '@/types';

// Query Keys
export const simulationKeys = {
  all: ['simulations'] as const,
  lists: () => [...simulationKeys.all, 'list'] as const,
  list: (filters?: any) => [...simulationKeys.lists(), { filters }] as const,
  details: () => [...simulationKeys.all, 'detail'] as const,
  detail: (id: string) => [...simulationKeys.details(), id] as const,
  results: () => [...simulationKeys.all, 'results'] as const,
  result: (id: string) => [...simulationKeys.results(), id] as const,
};

// Get all simulations
export const useSimulations = (filters?: any) => {
  return useQuery({
    queryKey: simulationKeys.list(filters),
    queryFn: () => simulationApi.getAll(filters),
  });
};

// Get single simulation by ID
export const useSimulation = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.detail(id),
    queryFn: () => simulationApi.getById(id),
    enabled: !!id,
  });
};

// Get simulation results
export const useSimulationResults = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.result(id),
    queryFn: () => simulationApi.getResults(id),
    enabled: !!id,
  });
};

// Run simulation mutation
export const useRunSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RunSimulationRequest) => simulationApi.run(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
      toast.success('Simulation started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to run simulation');
    },
  });
};

// Poll simulation status
export const useSimulationStatus = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...simulationKeys.detail(id), 'status'],
    queryFn: () => simulationApi.getById(id),
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      // Poll every 2 seconds if simulation is running
      const simulation = query.state.data as Simulation | undefined;
      if (
        simulation?.status === SimulationStatus.RUNNING ||
        simulation?.status === SimulationStatus.PENDING
      ) {
        return 2000;
      }
      return false;
    },
  });
};

// Cancel simulation mutation
export const useCancelSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => simulationApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
      toast.success('Simulation cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel simulation');
    },
  });
};

// Made with Bob