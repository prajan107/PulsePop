import React from 'react';
import { Database } from 'lucide-react';
import { SourceDistribution } from '@/features/analytics/types';
import { ChartCard } from '@/components/charts/ChartCard';
import { DonutChart } from '@/components/charts/DonutChart';

interface SourceDistributionChartProps {
  sources: SourceDistribution[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const SourceDistributionChart: React.FC<SourceDistributionChartProps> = ({
  sources,
  isLoading,
  isError,
  onRetry,
}) => {
  const chartData = sources.map((item) => ({
    name: item.source,
    value: item.count,
  }));

  return (
    <ChartCard
      title="Source Distribution"
      subtitle="Share of ingested trend signals by data source platform"
      icon={Database}
      iconColor="text-[#818CF8]"
      isLoading={isLoading}
      isError={isError}
      errorMessage="Analytics unavailable."
      onRetry={onRetry}
    >
      <DonutChart data={chartData} innerRadius={50} outerRadius={80} />
    </ChartCard>
  );
};
