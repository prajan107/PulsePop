import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonitoringHeaderProps {
  onRefresh: () => void;
  lastUpdated?: string;
}

export const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({
  onRefresh,
  lastUpdated,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2937]">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981]">
          <Activity className="h-3.5 w-3.5 text-[#10B981]" /> Operations Observability
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Monitoring
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Real-time component health, database connectivity, AI provider metrics, and collector status.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="text-[11px] text-[#64748B]">Updated: {lastUpdated}</span>
        )}
        <Button variant="outline" size="sm" onClick={onRefresh} className="border-[#1F2937] text-xs h-9">
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh Status
        </Button>
      </div>
    </div>
  );
};
