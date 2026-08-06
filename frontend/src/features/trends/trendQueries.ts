import { useQuery } from '@tanstack/react-query';
import { trendService } from './trendService';
import { TrendFilterParams } from './types';

export const trendKeys = {
  all: ['trends'] as const,
  lists: () => [...trendKeys.all, 'list'] as const,
  list: (params: TrendFilterParams) => [...trendKeys.lists(), params] as const,
  details: () => [...trendKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...trendKeys.details(), id] as const,
};

export const useTrends = (params: TrendFilterParams = {}) => {
  return useQuery({
    queryKey: trendKeys.list(params),
    queryFn: () => trendService.getTrends(params),
  });
};

export const useTrendDetail = (id: number | string) => {
  return useQuery({
    queryKey: trendKeys.detail(id),
    queryFn: () => trendService.getTrendById(id),
    enabled: !!id,
  });
};
