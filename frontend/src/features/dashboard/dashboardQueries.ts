import { useQuery } from '@tanstack/react-query';
import { dashboardService } from './dashboardService';

export const dashboardKeys = {
  all: ['analytics'] as const,
  overview: (days?: number) => [...dashboardKeys.all, 'overview', days] as const,
  topTrends: (limit?: number, days?: number) => [...dashboardKeys.all, 'top-trends', limit, days] as const,
};

export const useAnalyticsOverview = (days?: number) => {
  return useQuery({
    queryKey: dashboardKeys.overview(days),
    queryFn: () => dashboardService.getOverview(days),
  });
};

export const useTopTrends = (limit = 10, days?: number) => {
  return useQuery({
    queryKey: dashboardKeys.topTrends(limit, days),
    queryFn: () => dashboardService.getTopTrends(limit, days),
  });
};
