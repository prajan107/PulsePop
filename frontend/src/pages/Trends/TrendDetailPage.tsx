import React from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Clock, Cpu, Flame, Folder, Info, Key, Layers, Server } from 'lucide-react';
import { useTrendDetail } from '@/features/trends/trendQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { SentimentBadge } from '@/components/trends/SentimentBadge';
import { SourceBadge } from '@/components/trends/SourceBadge';
import { TrendDetailHeader } from '@/components/trends/TrendDetailHeader';
import { TrendScoreBadge } from '@/components/trends/TrendScoreBadge';

export const TrendDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: trend, isLoading, isError } = useTrendDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !trend) {
    return (
      <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-8 text-center text-xs text-[#EF4444]">
        Trend record not found or error loading trend details from backend server.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <TrendDetailHeader trend={trend} />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary & Analytics Overview Card */}
        <Card className="lg:col-span-2 border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-[#6366F1]" /> Signal Summary & AI Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0F172A]/70 border border-[#1F2937] text-sm text-[#F8FAFC] leading-relaxed">
              {trend.summary || 'No detailed summary provided for this trend cluster.'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0F172A]/50 border border-[#1F2937] space-y-1">
                <span className="text-[#64748B] font-semibold block flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-[#6366F1]" /> Trend Score
                </span>
                <div className="pt-1">
                  <TrendScoreBadge score={trend.trend_score} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A]/50 border border-[#1F2937] space-y-1">
                <span className="text-[#64748B] font-semibold block flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-[#F59E0B]" /> Popularity
                </span>
                <span className="text-base font-bold font-mono text-white">
                  {(trend.popularity_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A]/50 border border-[#1F2937] space-y-1">
                <span className="text-[#64748B] font-semibold block flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Sentiment
                </span>
                <div className="pt-1">
                  <SentimentBadge score={trend.sentiment_score} />
                </div>
              </div>
            </div>

            {/* Additional AI / Pipeline Metadata Section */}
            <div className="rounded-xl border border-[#1F2937] bg-[#0F172A]/40 p-4 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#818CF8]" /> AI Processing & Intelligence Context
              </h4>
              <p className="text-[#94A3B8] text-[11px]">
                Analyzed via PulsePop NLP Pipeline v1.0 using SQLAlchemy 2.x and FastAPI async services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Sidebar Card */}
        <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Folder className="h-5 w-5 text-[#818CF8]" /> Cluster Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <span className="text-[#64748B] font-semibold flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-[#6366F1]" /> Cluster ID
                </span>
                <span className="font-mono text-white font-bold">#{trend.id}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <span className="text-[#64748B] font-semibold">Category ID</span>
                <span className="font-mono text-white font-bold">
                  {trend.category_id ? `#${trend.category_id}` : 'Uncategorized'}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <span className="text-[#64748B] font-semibold">Source Platform</span>
                <SourceBadge sourceId={trend.source_id} />
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <span className="text-[#64748B] font-semibold">Raw Sentiment</span>
                <span className="font-mono text-white font-semibold">
                  {trend.sentiment_score.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <span className="text-[#64748B] font-semibold flex items-center gap-1">
                  <Server className="h-3.5 w-3.5 text-[#10B981]" /> Status
                </span>
                <span className="text-[#10B981] font-semibold">Indexed</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1F2937] space-y-2 text-[#94A3B8] text-[11px]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#64748B]" /> Published: {new Date(trend.created_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#64748B]" /> Updated: {new Date(trend.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
