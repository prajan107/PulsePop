import React from 'react';
import { Server, Terminal } from 'lucide-react';
import { SystemMetrics } from '@/features/monitoring/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemStatusProps {
  metrics: SystemMetrics;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ metrics }) => {
  const app = metrics.application;

  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Server className="h-5 w-5 text-[#F59E0B]" /> Runtime Platform Specs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5 text-xs">
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
          <span className="text-[#64748B] font-semibold">Backend Service</span>
          <span className="font-semibold text-white">{app.app_name}</span>
        </div>
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
          <span className="text-[#64748B] font-semibold">Version</span>
          <span className="font-mono text-[#818CF8]">v{app.version}</span>
        </div>
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
          <span className="text-[#64748B] font-semibold">Pipeline Schema</span>
          <span className="font-mono text-[#10B981]">v{app.pipeline_version}</span>
        </div>
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
          <span className="text-[#64748B] font-semibold flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5 text-[#38BDF8]" /> Python Runtime
          </span>
          <span className="font-mono text-white">Python {app.python_version}</span>
        </div>
      </CardContent>
    </Card>
  );
};
