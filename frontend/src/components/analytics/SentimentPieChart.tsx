import React from 'react';
import { Smile } from 'lucide-react';
import { SentimentDistribution } from '@/features/analytics/types';
import { ChartCard } from '@/components/charts/ChartCard';
import { PieChart, PieChartItem } from '@/components/charts/PieChart';

interface SentimentPieChartProps {
  sentiment: SentimentDistribution;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const SentimentPieChart: React.FC<SentimentPieChartProps> = ({
  sentiment,
  isLoading,
  isError,
  onRetry,
}) => {
  const chartData: PieChartItem[] = [
    { name: 'Positive', value: sentiment.positive, color: '#10B981' },
    { name: 'Neutral', value: sentiment.neutral, color: '#6366F1' },
    { name: 'Negative', value: sentiment.negative, color: '#EF4444' },
  ].filter((item) => item.value > 0);

  return (
    <ChartCard
      title="Sentiment Ratio"
      subtitle="NLP sentiment classification breakdown across processed signals"
      icon={Smile}
      iconColor="text-[#10B981]"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Analytics unavailable."
      onRetry={onRetry}
    >
      <PieChart data={chartData} innerRadius={55} outerRadius={85} />
    </ChartCard>
  );
};
