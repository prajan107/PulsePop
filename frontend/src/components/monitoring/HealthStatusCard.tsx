import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { HealthStatus } from '@/features/monitoring/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';

interface HealthStatusCardProps {
  health: HealthStatus;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ health }) => {
  const services = [
    { label: 'PostgreSQL Database', status: health.database.status },
    { label: 'AI Inference Provider', status: health.ai_provider.status },
    { label: 'Background Scheduler', status: health.scheduler.status },
    { label: 'Data Collectors Engine', status: health.collectors.status },
  ];

  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#10B981]" /> System Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {services.map((srv) => (
          <div
            key={srv.label}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F172A]/70 border border-[#1F2937]"
          >
            <span className="font-semibold text-white">{srv.label}</span>
            <StatusBadge status={srv.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
