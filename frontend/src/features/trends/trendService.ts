import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Trend, TrendFilterParams, TrendListResponse } from './types';

export const trendService = {
  getTrends: async (params: TrendFilterParams = {}): Promise<TrendListResponse> => {
    // Filter out undefined or empty values
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== '' && v !== null
      )
    );

    const response = await apiClient.get<TrendListResponse>(
      API_ENDPOINTS.TRENDS.LIST,
      { params: cleanedParams }
    );
    return response.data;
  },

  getTrendById: async (id: number | string): Promise<Trend> => {
    const response = await apiClient.get<Trend>(
      API_ENDPOINTS.TRENDS.DETAIL(id)
    );
    return response.data;
  },
};
