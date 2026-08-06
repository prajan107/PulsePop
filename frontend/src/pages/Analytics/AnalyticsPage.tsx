import React, { useState } from 'react';
import { Activity, Clock, Cpu, Layers, TrendingUp } from 'lucide-react';
import {
  useAnalyticsEntities,
  useAnalyticsOverview,
  useAnalyticsSentiment,
  useAnalyticsSources,
  useAnalyticsTopics,
  useAnalyticsTopTrends,
} from '@/features/analytics/analyticsQueries';
import { AnalyticsEmptyState } from '@/components/analytics/AnalyticsEmptyState';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';
import { SentimentPieChart } from '@/components/analytics/SentimentPieChart';
import { SourceDistributionChart } from '@/components/analytics/SourceDistributionChart';
import { TopicDistributionChart } from '@/components/analytics/TopicDistributionChart';
import { TopEntitiesTable } from '@/components/analytics/TopEntitiesTable';
import { TrendScoreChart } from '@/components/analytics/TrendScoreChart';
import { KPIStatCard } from '@/components/common/KPIStatCard';

export const AnalyticsPage: React.FC = () => {
  const [days, setDays] = useState<number | undefined>(undefined);

  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview(days);

  const {
    data: topTrends = [],
    isLoading: isTrendsLoading,
    refetch: refetchTrends,
  } = useAnalyticsTopTrends(10, days);

  const {
    data: topics = [],
    isLoading: isTopicsLoading,
    refetch: refetchTopics,
  } = useAnalyticsTopics(10, days);

  const {
    data: entities = [],
    isLoading: isEntitiesLoading,
    refetch: refetchEntities,
  } = useAnalyticsEntities(10, days);

  const {
    data: sentiment,
    isLoading: isSentimentLoading,
    refetch: refetchSentiment,
  } = useAnalyticsSentiment(days);

  const {
    data: sources = [],
    isLoading: isSourcesLoading,
    refetch: refetchSources,
  } = useAnalyticsSources(days);

  const isLoading =
    isOverviewLoading ||
    isTrendsLoading ||
    isTopicsLoading ||
    isEntitiesLoading ||
    isSentimentLoading ||
    isSourcesLoading;

  const handleRefreshAll = () => {
    refetchOverview();
    refetchTrends();
    refetchTopics();
    refetchEntities();
    refetchSentiment();
    refetchSources();
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isOverviewError || !overview) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader days={days} onDaysChange={setDays} onRefresh={handleRefreshAll} />
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-xs text-[#EF4444]">
          Analytics unavailable. Please check backend API status and retry.
        </div>
      </div>
    );
  }

  const hasData = overview.total_raw_trends > 0 || overview.total_clusters > 0;

  return (
    <div className="space-y-8">
      <AnalyticsHeader days={days} onDaysChange={setDays} onRefresh={handleRefreshAll} />

      {!hasData ? (
        <AnalyticsEmptyState onRefresh={handleRefreshAll} />
      ) : (
        <>
          {/* SECTION 1: Overview Cards */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Overview Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <KPIStatCard
                title="Total Raw Trends"
                value={overview.total_raw_trends.toLocaleString()}
                subtitle="Signal volume"
                icon={Activity}
                iconColor="text-[#6366F1]"
                badge="Ingested"
              />
              <KPIStatCard
                title="Total Clusters"
                value={overview.total_clusters.toLocaleString()}
                subtitle="Correlated groups"
                icon={Layers}
                iconColor="text-[#818CF8]"
                badge="Clusters"
              />
              <KPIStatCard
                title="Avg Trend Score"
                value={overview.average_trend_score.toFixed(1)}
                subtitle="Velocity index"
                icon={TrendingUp}
                iconColor="text-[#10B981]"
                badge="Velocity"
                badgeVariant="success"
              />
              <KPIStatCard
                title="Avg Sentiment"
                value={`${(overview.average_sentiment_confidence * 100).toFixed(0)}%`}
                subtitle="NLP confidence"
                icon={Cpu}
                iconColor="text-[#F59E0B]"
                badge="AI Model"
                badgeVariant="warning"
              />
              <KPIStatCard
                title="Avg Processing Time"
                value={`${overview.average_processing_time_ms.toFixed(0)}ms`}
                subtitle="Execution latency"
                icon={Clock}
                iconColor="text-[#38BDF8]"
                badge="Latency"
              />
            </div>
          </section>

          {/* SECTION 2: Trend Intelligence */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Trend Intelligence & Topics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendScoreChart trends={topTrends} onRetry={refetchTrends} />
              <TopicDistributionChart topics={topics} onRetry={refetchTopics} />
            </div>
          </section>

          {/* SECTION 3: Sentiment & Source Analysis */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Sentiment & Source Breakdown
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sentiment && <SentimentPieChart sentiment={sentiment} onRetry={refetchSentiment} />}
              <SourceDistributionChart sources={sources} onRetry={refetchSources} />
            </div>
          </section>

          {/* SECTION 4: Top Entities Table */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Entity Modeling
            </h2>
            <TopEntitiesTable entities={entities} />
          </section>
        </>
      )}
    </div>
  );
};
