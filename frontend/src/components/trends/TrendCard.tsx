import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Trend } from '@/features/trends/types';
import { Card, CardContent } from '@/components/ui/card';
import { SentimentBadge } from './SentimentBadge';
import { SourceBadge } from './SourceBadge';
import { TrendScoreBadge } from './TrendScoreBadge';

interface TrendCardProps {
  trend: Trend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl hover:border-[#6366F1]/50 transition-all flex flex-col justify-between">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <TrendScoreBadge score={trend.trend_score} />
          <SourceBadge sourceId={trend.source_id} />
        </div>

        <div>
          <Link
            to={`/trends/${trend.id}`}
            className="text-base font-bold text-white hover:text-[#818CF8] transition-colors line-clamp-2"
          >
            {trend.title}
          </Link>
          {trend.summary && (
            <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-3 leading-relaxed">
              {trend.summary}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs">
          <SentimentBadge score={trend.sentiment_score} />
          <div className="flex items-center gap-1 text-[#64748B] text-[11px]">
            <Flame className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>Pop: {(trend.popularity_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>ID: #{trend.id}</span>
          <Link
            to={`/trends/${trend.id}`}
            className="inline-flex items-center font-semibold text-[#818CF8] hover:underline"
          >
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
