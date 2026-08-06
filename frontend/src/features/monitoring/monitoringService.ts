import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { HealthStatus, SystemMetrics } from './types';

export const monitoringService = {
  getMetrics: async (): Promise<SystemMetrics> => {
    const response = await apiClient.get<SystemMetrics>(API_ENDPOINTS.MONITORING.METRICS);
    return response.data;
  },

  getHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get<HealthStatus>(API_ENDPOINTS.MONITORING.HEALTH);
    return response.data;
  },
};
