import { useQuery } from '@tanstack/react-query';
import { analyticsService } from './analyticsService';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (days?: number) => [...analyticsKeys.all, 'overview', days] as const,
  topTrends: (limit?: number, days?: number) => [...analyticsKeys.all, 'top-trends', limit, days] as const,
  topics: (limit?: number, days?: number) => [...analyticsKeys.all, 'topics', limit, days] as const,
  entities: (limit?: number, days?: number) => [...analyticsKeys.all, 'entities', limit, days] as const,
  sentiment: (days?: number) => [...analyticsKeys.all, 'sentiment', days] as const,
  sources: (days?: number) => [...analyticsKeys.all, 'sources', days] as const,
};

const DEFAULT_ANALYTICS_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
};

export const useAnalyticsOverview = (days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.overview(days),
    queryFn: () => analyticsService.getOverview(days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};

export const useAnalyticsTopTrends = (limit = 10, days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.topTrends(limit, days),
    queryFn: () => analyticsService.getTopTrends(limit, days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};

export const useAnalyticsTopics = (limit = 10, days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.topics(limit, days),
    queryFn: () => analyticsService.getTopics(limit, days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};

export const useAnalyticsEntities = (limit = 10, days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.entities(limit, days),
    queryFn: () => analyticsService.getEntities(limit, days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};

export const useAnalyticsSentiment = (days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.sentiment(days),
    queryFn: () => analyticsService.getSentiment(days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};

export const useAnalyticsSources = (days?: number) => {
  return useQuery({
    queryKey: analyticsKeys.sources(days),
    queryFn: () => analyticsService.getSources(days),
    ...DEFAULT_ANALYTICS_QUERY_OPTIONS,
  });
};
