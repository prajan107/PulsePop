import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { AnalyticsOverview, TopTrend } from './types';

export const dashboardService = {
  getOverview: async (days?: number): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<AnalyticsOverview>(
      API_ENDPOINTS.ANALYTICS.OVERVIEW,
      { params: { days } }
    );
    return response.data;
  },

  getTopTrends: async (limit = 10, days?: number): Promise<TopTrend[]> => {
    const response = await apiClient.get<TopTrend[]>(
      API_ENDPOINTS.ANALYTICS.TOP_TRENDS,
      { params: { limit, days } }
    );
    return response.data;
  },
};
