import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Smile, 
  Layers, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCardData } from '@/types';
import { cn } from '@/utils/cn';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp,
  Zap,
  Smile,
  Layers,
  Activity
};

interface MetricCardProps {
  data: MetricCardData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const IconComponent = ICON_MAP[data.iconName] || TrendingUp;

  return (
    <Card className="relative overflow-hidden border border-[#1F2937] bg-[#111827] transition-all duration-300 hover:border-[#6366F1]/50 hover:shadow-lg hover:shadow-[#6366F1]/10">
      {/* Background glow accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#6366F1]/5 blur-2xl pointer-events-none" />

      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {data.title}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E293B] border border-[#374151]/50 text-[#818CF8]">
            <IconComponent className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
            {data.value}
          </div>
          <div className={cn(
            "flex items-center space-x-1 rounded-md px-2 py-0.5 text-xs font-semibold",
            data.isPositive 
              ? "bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30" 
              : "bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30"
          )}>
            {data.isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <span>{data.change > 0 ? `+${data.change}%` : `${data.change}%`}</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-[#94A3B8] line-clamp-1">
          {data.description}
        </p>
      </CardContent>
    </Card>
  );
};
