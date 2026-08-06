import React from 'react';
import { Cpu } from 'lucide-react';
import { SystemMetrics } from '@/features/monitoring/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';

interface AIProviderStatusProps {
  metrics: SystemMetrics;
  status: string;
}

export const AIProviderStatus: React.FC<AIProviderStatusProps> = ({ metrics, status }) => {
  const total = metrics.ai.completed_analyses + metrics.ai.failed_analyses;
  const successRate = total > 0 ? (metrics.ai.completed_analyses / total) * 100 : 100;

  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#6366F1]" /> AI Provider & Inference Engine
          </CardTitle>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1">
            <span className="text-[#64748B] font-semibold">Completed AI Analyses</span>
            <p className="text-xl font-bold font-mono text-white">
              {metrics.ai.completed_analyses}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1">
            <span className="text-[#64748B] font-semibold">Avg Processing Latency</span>
            <p className="text-xl font-bold font-mono text-[#38BDF8]">
              {metrics.ai.average_processing_time_ms.toFixed(0)} ms
            </p>
          </div>
        </div>

        {/* Progress Bar for Success Rate */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between font-semibold text-[#94A3B8]">
            <span>NLP Pipeline Success Rate</span>
            <span className="font-mono text-white">{successRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#1F2937] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#10B981] rounded-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
