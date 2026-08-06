import { useQuery } from '@tanstack/react-query';
import { monitoringService } from './monitoringService';

export const monitoringKeys = {
  all: ['monitoring'] as const,
  metrics: () => [...monitoringKeys.all, 'metrics'] as const,
  health: () => [...monitoringKeys.all, 'health'] as const,
};

export const useMonitoringMetrics = () => {
  return useQuery({
    queryKey: monitoringKeys.metrics(),
    queryFn: () => monitoringService.getMetrics(),
    refetchInterval: 30000, // 30-second live telemetry polling
  });
};

export const useMonitoringHealth = () => {
  return useQuery({
    queryKey: monitoringKeys.health(),
    queryFn: () => monitoringService.getHealth(),
    refetchInterval: 30000, // 30-second live telemetry polling
  });
};
