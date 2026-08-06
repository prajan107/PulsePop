import React from 'react';
import { Smile, Frown, Meh } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SentimentBadgeProps {
  score: number;
  className?: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ score, className }) => {
  let label = 'Neutral';
  let Icon = Meh;
  let colorClasses = 'bg-[#64748B]/10 text-[#94A3B8] border-[#64748B]/30';

  if (score >= 0.25) {
    label = 'Positive';
    Icon = Smile;
    colorClasses = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
  } else if (score <= -0.25) {
    label = 'Negative';
    Icon = Frown;
    colorClasses = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border',
        colorClasses,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label} ({score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)})
    </span>
  );
};
