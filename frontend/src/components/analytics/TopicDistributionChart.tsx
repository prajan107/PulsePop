import React from 'react';
import { Tag } from 'lucide-react';
import { TrendingTopic } from '@/features/analytics/types';
import { BarChart, BarChartItem } from '@/components/charts/BarChart';
import { ChartCard } from '@/components/charts/ChartCard';

interface TopicDistributionChartProps {
  topics: TrendingTopic[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const TopicDistributionChart: React.FC<TopicDistributionChartProps> = ({
  topics,
  isLoading,
  isError,
  onRetry,
}) => {
  const chartData: BarChartItem[] = topics.map((t) => ({
    name: t.topic.length > 20 ? t.topic.substring(0, 18) + '...' : t.topic,
    fullTopic: t.topic,
    value: t.count,
  }));

  return (
    <ChartCard
      title="Top Trending Topics"
      subtitle="Most frequently extracted keyword & topic clusters"
      icon={Tag}
      iconColor="text-[#F59E0B]"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Analytics unavailable."
      onRetry={onRetry}
    >
      <BarChart data={chartData} layout="vertical" unit=" occurrences" />
    </ChartCard>
  );
};
