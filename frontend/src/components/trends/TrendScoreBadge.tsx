import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TrendScoreBadgeProps {
  score: number;
  className?: string;
}

export const TrendScoreBadge: React.FC<TrendScoreBadgeProps> = ({ score, className }) => {
  let colorClasses = 'bg-[#6366F1]/10 text-[#818CF8] border-[#6366F1]/30';
  if (score >= 80) {
    colorClasses = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
  } else if (score >= 50) {
    colorClasses = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 text-xs rounded-md border',
        colorClasses,
        className
      )}
    >
      <TrendingUp className="h-3 w-3" />
      {score.toFixed(1)}
    </span>
  );
};
