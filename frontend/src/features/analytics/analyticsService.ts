import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import {
  AnalyticsOverview,
  SentimentDistribution,
  SourceDistribution,
  TopTrendItem,
  TrendingEntity,
  TrendingTopic,
} from './types';

export const analyticsService = {
  getOverview: async (days?: number): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<AnalyticsOverview>(
      API_ENDPOINTS.ANALYTICS.OVERVIEW,
      { params: { days } }
    );
    return response.data;
  },

  getTopTrends: async (limit = 10, days?: number): Promise<TopTrendItem[]> => {
    const response = await apiClient.get<TopTrendItem[]>(
      API_ENDPOINTS.ANALYTICS.TOP_TRENDS,
      { params: { limit, days } }
    );
    return response.data;
  },

  getTopics: async (limit = 10, days?: number): Promise<TrendingTopic[]> => {
    const response = await apiClient.get<TrendingTopic[]>(
      API_ENDPOINTS.ANALYTICS.TOPICS,
      { params: { limit, days } }
    );
    return response.data;
  },

  getEntities: async (limit = 10, days?: number): Promise<TrendingEntity[]> => {
    const response = await apiClient.get<TrendingEntity[]>(
      API_ENDPOINTS.ANALYTICS.ENTITIES,
      { params: { limit, days } }
    );
    return response.data;
  },

  getSentiment: async (days?: number): Promise<SentimentDistribution> => {
    const response = await apiClient.get<SentimentDistribution>(
      API_ENDPOINTS.ANALYTICS.SENTIMENT,
      { params: { days } }
    );
    return response.data;
  },

  getSources: async (days?: number): Promise<SourceDistribution[]> => {
    const response = await apiClient.get<SourceDistribution[]>(
      API_ENDPOINTS.ANALYTICS.SOURCES,
      { params: { days } }
    );
    return response.data;
  },
};
