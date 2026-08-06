import React from 'react';
import { TrendingUp } from 'lucide-react';
import { TopTrendItem } from '@/features/analytics/types';
import { BarChart, BarChartItem } from '@/components/charts/BarChart';
import { ChartCard } from '@/components/charts/ChartCard';

interface TrendScoreChartProps {
  trends: TopTrendItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const TrendScoreChart: React.FC<TrendScoreChartProps> = ({
  trends,
  isLoading,
  isError,
  onRetry,
}) => {
  const chartData: BarChartItem[] = trends.map((item) => ({
    name: item.canonical_title.length > 18 ? item.canonical_title.substring(0, 16) + '...' : item.canonical_title,
    fullTitle: item.canonical_title,
    value: Number(item.trend_score.toFixed(1)),
  }));

  return (
    <ChartCard
      title="Top Trend Velocity Scores"
      subtitle="Comparative velocity and momentum ranking across top clusters"
      icon={TrendingUp}
      iconColor="text-[#6366F1]"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Analytics unavailable."
      onRetry={onRetry}
    >
      <BarChart data={chartData} unit=" pts" />
    </ChartCard>
  );
};
