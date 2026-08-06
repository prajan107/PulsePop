import React from 'react';
import { ArrowDownAZ, ArrowUpZA, Filter, SlidersHorizontal } from 'lucide-react';
import { TrendFilterParams } from '@/features/trends/types';

interface TrendFiltersProps {
  filters: TrendFilterParams;
  onFilterChange: (newFilters: Partial<TrendFilterParams>) => void;
  onReset: () => void;
}

export const TrendFilters: React.FC<TrendFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const sortOptions = [
    { label: 'Date Created', value: 'created_at' },
    { label: 'Trend Score', value: 'trend_score' },
    { label: 'Popularity Score', value: 'popularity_score' },
  ];

  const sourceOptions = [
    { label: 'All Sources', value: undefined },
    { label: 'Twitter', value: 1 },
    { label: 'Reddit', value: 2 },
    { label: 'GitHub', value: 3 },
    { label: 'ProductHunt', value: 4 },
    { label: 'News', value: 5 },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: undefined },
    { label: 'AI & ML (Cat 1)', value: 1 },
    { label: 'Dev Tools (Cat 2)', value: 2 },
    { label: 'SaaS (Cat 3)', value: 3 },
    { label: 'Crypto (Cat 4)', value: 4 },
  ];

  const sentimentOptions = [
    { label: 'All Sentiments', value: undefined },
    { label: 'Positive (Score >= 0.25)', value: 'positive' },
    { label: 'Neutral (-0.25 to 0.25)', value: 'neutral' },
    { label: 'Negative (Score <= -0.25)', value: 'negative' },
  ];

  const currentOrder = filters.order || 'desc';

  const toggleOrder = () => {
    onFilterChange({ order: currentOrder === 'desc' ? 'asc' : 'desc' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#111827]/70 border border-[#1F2937] p-3 rounded-2xl backdrop-blur-xl text-xs">
      <div className="flex items-center gap-1.5 text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider mr-1">
        <Filter className="h-3.5 w-3.5 text-[#6366F1]" /> Filters
      </div>

      {/* Sort By Select */}
      <div className="flex items-center gap-1.5">
        <span className="text-[#64748B]">Sort:</span>
        <select
          value={filters.sort_by || 'created_at'}
          onChange={(e) => onFilterChange({ sort_by: e.target.value, page: 1 })}
          className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-2.5 py-1.5 text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={toggleOrder}
          title={`Order: ${currentOrder.toUpperCase()}. Click to switch.`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F2937] bg-[#0F172A] text-[#94A3B8] hover:text-white transition-colors"
        >
          {currentOrder === 'desc' ? (
            <ArrowDownAZ className="h-4 w-4 text-[#818CF8]" />
          ) : (
            <ArrowUpZA className="h-4 w-4 text-[#818CF8]" />
          )}
        </button>
      </div>

      {/* Category Select */}
      <div className="flex items-center gap-1.5">
        <span className="text-[#64748B]">Category:</span>
        <select
          value={filters.category_id ?? ''}
          onChange={(e) =>
            onFilterChange({
              category_id: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
          className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-2.5 py-1.5 text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Source Select */}
      <div className="flex items-center gap-1.5">
        <span className="text-[#64748B]">Source:</span>
        <select
          value={filters.source_id ?? ''}
          onChange={(e) =>
            onFilterChange({
              source_id: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
          className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-2.5 py-1.5 text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
        >
          {sourceOptions.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Extensible Sentiment Select */}
      <div className="flex items-center gap-1.5">
        <span className="text-[#64748B]">Sentiment:</span>
        <select
          value={(filters as Record<string, unknown>).sentiment as string || ''}
          onChange={(e) =>
            onFilterChange({
              sentiment: e.target.value || undefined,
              page: 1,
            } as Partial<TrendFilterParams>)
          }
          className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-2.5 py-1.5 text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
        >
          {sentimentOptions.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#818CF8] hover:underline"
      >
        <SlidersHorizontal className="h-3 w-3" /> Reset
      </button>
    </div>
  );
};
