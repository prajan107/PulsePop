import React, { useState } from 'react';
import { Activity, Clock, Cpu, Layers, TrendingUp } from 'lucide-react';
import { useAnalyticsOverview, useTopTrends } from '@/features/dashboard/dashboardQueries';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import { QuickActions } from '@/components/dashboard/widgets/QuickActions';
import { RecentTrendsTable } from '@/components/dashboard/widgets/RecentTrendsTable';
import { StatsCard } from '@/components/dashboard/widgets/StatsCard';

export const DashboardPage: React.FC = () => {
  const [days, setDays] = useState<number | undefined>(undefined);

  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview(days);

  const {
    data: topTrends = [],
    isLoading: isTopTrendsLoading,
    isError: isTopTrendsError,
    refetch: refetchTopTrends,
  } = useTopTrends(10, days);

  const isLoading = isOverviewLoading || isTopTrendsLoading;
  const isError = isOverviewError || isTopTrendsError;

  const handleRefresh = () => {
    refetchOverview();
    refetchTopTrends();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <DashboardHeader days={days} onDaysChange={setDays} />
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-xs text-[#EF4444]">
          Failed to load dashboard analytics from backend APIs. Please ensure backend server is operational.
        </div>
      </div>
    );
  }

  const hasData = overview && (overview.total_raw_trends > 0 || overview.total_clusters > 0 || topTrends.length > 0);

  return (
    <div className="space-y-6">
      <DashboardHeader days={days} onDaysChange={setDays} />

      {!hasData ? (
        <EmptyDashboard onRefresh={handleRefresh} />
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Raw Trends"
              value={overview.total_raw_trends.toLocaleString()}
              description="Ingested signal volume"
              icon={Activity}
              iconColor="text-[#6366F1]"
              badgeText="Ingested"
              badgeVariant="neutral"
            />
            <StatsCard
              title="Total Clusters"
              value={overview.total_clusters.toLocaleString()}
              description="Grouped trend topics"
              icon={Layers}
              iconColor="text-[#818CF8]"
              badgeText="Active"
              badgeVariant="neutral"
            />
            <StatsCard
              title="Avg Trend Score"
              value={overview.average_trend_score.toFixed(1)}
              description="Platform-wide velocity"
              icon={TrendingUp}
              iconColor="text-[#10B981]"
              badgeText="Score"
              badgeVariant="success"
            />
            <StatsCard
              title="Avg Sentiment"
              value={`${(overview.average_sentiment_confidence * 100).toFixed(0)}%`}
              description="AI Confidence ratio"
              icon={Cpu}
              iconColor="text-[#F59E0B]"
              badgeText="AI Model"
              badgeVariant="warning"
            />
            <StatsCard
              title="Avg Processing Time"
              value={`${overview.average_processing_time_ms.toFixed(0)}ms`}
              description="Pipeline latency"
              icon={Clock}
              iconColor="text-[#38BDF8]"
              badgeText="Fast"
              badgeVariant="neutral"
            />
          </div>

          {/* Main Dashboard Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <RecentTrendsTable trends={topTrends} />
            </div>
            <div>
              <QuickActions onRefresh={handleRefresh} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
