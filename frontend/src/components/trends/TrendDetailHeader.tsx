import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Cpu, Hash } from 'lucide-react';
import { Trend } from '@/features/trends/types';
import { SentimentBadge } from './SentimentBadge';
import { SourceBadge } from './SourceBadge';
import { TrendScoreBadge } from './TrendScoreBadge';

interface TrendDetailHeaderProps {
  trend: Trend;
}

export const TrendDetailHeader: React.FC<TrendDetailHeaderProps> = ({ trend }) => {
  return (
    <div className="space-y-4 border-b border-[#1F2937] pb-6">
      <Link
        to="/trends"
        className="inline-flex items-center text-xs font-semibold text-[#818CF8] hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Trends Explorer
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-[#64748B] bg-[#1F2937] px-2 py-0.5 rounded">
              <Hash className="h-3 w-3" /> ID: {trend.id}
            </span>
            <TrendScoreBadge score={trend.trend_score} />
            <SourceBadge sourceId={trend.source_id} />
            <SentimentBadge score={trend.sentiment_score} />
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20">
              <Cpu className="h-3 w-3 text-[#6366F1]" /> Pipeline v1.0
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {trend.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Published: {new Date(trend.created_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              Updated: {new Date(trend.updated_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
