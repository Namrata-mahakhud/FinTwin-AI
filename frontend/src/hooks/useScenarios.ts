// React Query Hooks for Scenarios

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scenariosApi } from '@/services/api/scenarios.api';
import { toast } from '@/store/toastStore';
import type {
  Scenario,
  CreateScenarioRequest,
  UpdateScenarioRequest,
  ScenarioListFilters,
  PaginationParams,
} from '@/types';

// Query Keys
export const scenarioKeys = {
  all: ['scenarios'] as const,
  lists: () => [...scenarioKeys.all, 'list'] as const,
  list: (filters?: ScenarioListFilters, pagination?: PaginationParams) =>
    [...scenarioKeys.lists(), { filters, pagination }] as const,
  details: () => [...scenarioKeys.all, 'detail'] as const,
  detail: (id: string) => [...scenarioKeys.details(), id] as const,
};

// Get all scenarios with filters
export const useScenarios = (filters?: ScenarioListFilters, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: scenarioKeys.list(filters, pagination),
    queryFn: () => scenariosApi.getAll(filters, pagination),
  });
};

// Get single scenario by ID
export const useScenario = (id: string) => {
  return useQuery({
    queryKey: scenarioKeys.detail(id),
    queryFn: () => scenariosApi.getById(id),
    enabled: !!id,
  });
};

// Create scenario mutation
export const useCreateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScenarioRequest) => scenariosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      toast.success('Scenario created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create scenario');
    },
  });
};

// Update scenario mutation
export const useUpdateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScenarioRequest }) =>
      scenariosApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scenarioKeys.detail(variables.id) });
      toast.success('Scenario updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update scenario');
    },
  });
};

// Delete scenario mutation
export const useDeleteScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scenariosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      toast.success('Scenario deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete scenario');
    },
  });
};

// Duplicate scenario mutation
export const useDuplicateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scenariosApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      toast.success('Scenario duplicated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate scenario');
    },
  });
};

// Made with Bob
