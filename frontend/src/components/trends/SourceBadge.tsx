import React from 'react';
import { Database } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SourceBadgeProps {
  sourceId?: number | null;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceId, className }) => {
  const sourceNames: Record<number, string> = {
    1: 'Twitter',
    2: 'Reddit',
    3: 'GitHub',
    4: 'ProductHunt',
    5: 'News',
  };

  const name = sourceId ? sourceNames[sourceId] || `Source #${sourceId}` : 'Multi-Source';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#1F2937] text-[#CBD5E1] border border-[#374151]',
        className
      )}
    >
      <Database className="h-3 w-3 text-[#94A3B8]" />
      {name}
    </span>
  );
};
