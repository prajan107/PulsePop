import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, Layers } from 'lucide-react';
import { SystemMetrics } from '@/features/monitoring/types';
import { KPIStatCard } from '@/components/common/KPIStatCard';

interface MetricsGridProps {
  metrics: SystemMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const uptimeHours = (metrics.application.uptime_seconds / 3600).toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KPIStatCard
        title="Uptime"
        value={`${uptimeHours} hrs`}
        subtitle={`Raw: ${metrics.application.uptime_seconds.toFixed(0)} seconds`}
        icon={Clock}
        iconColor="text-[#38BDF8]"
        badge="System"
      />
      <KPIStatCard
        title="Processed Trends"
        value={metrics.ai.raw_trends_processed.toLocaleString()}
        subtitle="Ingested raw trends"
        icon={Activity}
        iconColor="text-[#6366F1]"
        badge="Ingested"
      />
      <KPIStatCard
        title="AI Analyses"
        value={metrics.ai.completed_analyses.toLocaleString()}
        subtitle="Successfully analyzed"
        icon={CheckCircle2}
        iconColor="text-[#10B981]"
        badge="NLP"
        badgeVariant="success"
      />
      <KPIStatCard
        title="Failed Analyses"
        value={metrics.ai.failed_analyses.toLocaleString()}
        subtitle="Pipeline failures"
        icon={AlertTriangle}
        iconColor="text-[#EF4444]"
        badge="Errors"
        badgeVariant="danger"
      />
      <KPIStatCard
        title="Correlations / Clusters"
        value={metrics.clusters.clusters.toLocaleString()}
        subtitle={`${metrics.clusters.correlations} correlations`}
        icon={Layers}
        iconColor="text-[#818CF8]"
        badge="Clusters"
      />
    </div>
  );
};
