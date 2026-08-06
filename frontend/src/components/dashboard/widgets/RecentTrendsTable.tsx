import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { TopTrend } from '@/features/dashboard/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendScoreBadge } from '@/components/trends/TrendScoreBadge';

interface RecentTrendsTableProps {
  trends: TopTrend[];
  isLoading?: boolean;
}

export const RecentTrendsTable: React.FC<RecentTrendsTableProps> = ({ trends }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#1F2937]">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#6366F1]" /> Top Performing Trends
          </CardTitle>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Highest scoring clusters extracted across active sources
          </p>
        </div>
        <Link
          to="/trends"
          className="inline-flex items-center text-xs font-semibold text-[#818CF8] hover:text-white transition-colors"
        >
          View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs text-[#CBD5E1]">
          <thead className="bg-[#0F172A]/70 text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#1F2937]">
            <tr>
              <th scope="col" className="px-4 py-3">Trend</th>
              <th scope="col" className="px-4 py-3">Trend Score</th>
              <th scope="col" className="px-4 py-3">Popularity</th>
              <th scope="col" className="px-4 py-3">Sources</th>
              <th scope="col" className="px-4 py-3 text-right">Updated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {trends.map((item) => (
              <tr key={item.id} className="hover:bg-[#1F2937]/50 transition-colors">
                <td className="px-4 py-3.5 font-medium text-white max-w-xs truncate">
                  <Link to={`/trends/${item.id}`} className="hover:text-[#818CF8] transition-colors">
                    {item.canonical_title}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <TrendScoreBadge score={item.trend_score} />
                </td>
                <td className="px-4 py-3.5 font-mono text-white">
                  {(item.popularity_score * 100).toFixed(0)}%
                </td>
                <td className="px-4 py-3.5 text-[#94A3B8]">
                  {item.source_diversity_score ? `${(item.source_diversity_score * 10).toFixed(1)} Diversity` : `${item.trend_count} Posts`}
                </td>
                <td className="px-4 py-3.5 text-right text-[#64748B] whitespace-nowrap">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
