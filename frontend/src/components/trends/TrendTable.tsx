import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Trend } from '@/features/trends/types';
import { SentimentBadge } from './SentimentBadge';
import { SourceBadge } from './SourceBadge';
import { TrendScoreBadge } from './TrendScoreBadge';

interface TrendTableProps {
  trends: Trend[];
}

export const TrendTable: React.FC<TrendTableProps> = ({ trends }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <table className="w-full text-left text-xs text-[#CBD5E1]">
        <thead className="bg-[#0F172A]/80 text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#1F2937]">
          <tr>
            <th scope="col" className="px-4 py-3.5">ID</th>
            <th scope="col" className="px-4 py-3.5">Title & Summary</th>
            <th scope="col" className="px-4 py-3.5">Trend Score</th>
            <th scope="col" className="px-4 py-3.5">Popularity</th>
            <th scope="col" className="px-4 py-3.5">Sentiment</th>
            <th scope="col" className="px-4 py-3.5">Source</th>
            <th scope="col" className="px-4 py-3.5 text-right">Created</th>
            <th scope="col" className="px-4 py-3.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F2937]">
          {trends.map((trend) => (
            <tr key={trend.id} className="hover:bg-[#1F2937]/40 transition-colors">
              <td className="px-4 py-4 font-mono text-[#64748B]">#{trend.id}</td>
              <td className="px-4 py-4 max-w-sm">
                <Link
                  to={`/trends/${trend.id}`}
                  className="font-bold text-white hover:text-[#818CF8] transition-colors line-clamp-1"
                >
                  {trend.title}
                </Link>
                {trend.summary && (
                  <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                    {trend.summary}
                  </p>
                )}
              </td>
              <td className="px-4 py-4">
                <TrendScoreBadge score={trend.trend_score} />
              </td>
              <td className="px-4 py-4 font-mono font-semibold text-white">
                {(trend.popularity_score * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-4">
                <SentimentBadge score={trend.sentiment_score} />
              </td>
              <td className="px-4 py-4">
                <SourceBadge sourceId={trend.source_id} />
              </td>
              <td className="px-4 py-4 text-right text-[#64748B] whitespace-nowrap">
                {new Date(trend.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-center">
                <Link
                  to={`/trends/${trend.id}`}
                  className="inline-flex items-center justify-center rounded-lg bg-[#6366F1]/10 px-2.5 py-1 text-xs font-semibold text-[#818CF8] hover:bg-[#6366F1]/20 transition-colors"
                >
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
