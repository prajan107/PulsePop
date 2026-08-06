import React from 'react';
import { Database, Server } from 'lucide-react';
import { useMonitoringHealth, useMonitoringMetrics } from '@/features/monitoring/monitoringQueries';
import { AIProviderStatus } from '@/components/monitoring/AIProviderStatus';
import { CollectorStatusTable } from '@/components/monitoring/CollectorStatusTable';
import { HealthStatusCard } from '@/components/monitoring/HealthStatusCard';
import { MetricsGrid } from '@/components/monitoring/MetricsGrid';
import { MonitoringHeader } from '@/components/monitoring/MonitoringHeader';
import { MonitoringSkeleton } from '@/components/monitoring/MonitoringSkeleton';
import { SystemStatus } from '@/components/monitoring/SystemStatus';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';

export const MonitoringPage: React.FC = () => {
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    refetch: refetchMetrics,
  } = useMonitoringMetrics();

  const {
    data: health,
    isLoading: isHealthLoading,
    isError: isHealthError,
    refetch: refetchHealth,
  } = useMonitoringHealth();

  const isLoading = isMetricsLoading || isHealthLoading;
  const isError = isMetricsError || isHealthError;

  const handleRefresh = () => {
    refetchMetrics();
    refetchHealth();
  };

  if (isLoading) {
    return <MonitoringSkeleton />;
  }

  if (isError || !metrics || !health) {
    return (
      <div className="space-y-6">
        <MonitoringHeader onRefresh={handleRefresh} />
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-xs text-[#EF4444]">
          Monitoring service unavailable. Please refresh or verify backend API health endpoints (`/api/v1/monitoring/metrics` or `/api/v1/monitoring/health`).
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MonitoringHeader onRefresh={handleRefresh} lastUpdated={new Date().toLocaleTimeString()} />

      {/* SECTION 1: System Overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          System Overview & Health
        </h2>
        <HealthStatusCard health={health} />
      </section>

      {/* SECTION 2: Application Metrics */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Application Operational Metrics
        </h2>
        <MetricsGrid metrics={metrics} />
      </section>

      {/* SECTION 3 & 4: Collector Health & AI Services */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          AI Services & Data Collectors
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CollectorStatusTable metrics={metrics} />
          </div>
          <div className="space-y-6">
            <AIProviderStatus metrics={metrics} status={health.ai_provider.status} />
            <SystemStatus metrics={metrics} />
          </div>
        </div>
      </section>

      {/* SECTION 5 & 6: Database & Scheduler Detailed Status */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Infrastructure Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">PostgreSQL Database</h4>
                  <p className="text-[10px] text-[#64748B]">Async Session Connection Pool</p>
                </div>
              </div>
              <StatusBadge status={health.database.status} />
            </CardContent>
          </Card>

          <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Background Scheduler</h4>
                  <p className="text-[10px] text-[#64748B]">APScheduler Cron Engine</p>
                </div>
              </div>
              <StatusBadge status={health.scheduler.status} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
