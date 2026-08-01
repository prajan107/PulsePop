import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bell, ArrowRight, TrendingUp, Tag, Flame } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TrendGrowthChart } from '@/components/charts/TrendGrowthChart';
import { SentimentPieChart } from '@/components/charts/SentimentPieChart';
import { SourceDistChart } from '@/components/charts/SourceDistChart';
import { CategoryDistChart } from '@/components/charts/CategoryDistChart';
import { LatestTrendsTable } from '@/components/trend/LatestTrendsTable';
import { 
  MOCK_METRICS, 
  MOCK_ALERTS, 
  MOCK_TRENDING_KEYWORDS, 
  MOCK_TOP_CATEGORIES 
} from '@/mocks/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Intelligence Overview <Sparkles className="h-6 w-6 text-[#6366F1]" />
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Real-time cross-platform signals, AI cluster velocity, and automated trend predictions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/search')}
            className="border-[#1F2937] hover:bg-[#1F2937]"
          >
            Explore All Trends
          </Button>
          <Button 
            onClick={() => navigate('/alerts')}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center gap-2"
          >
            <Bell className="h-4 w-4" /> Manage Alerts
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_METRICS.map((metric) => (
          <MetricCard key={metric.id} data={metric} />
        ))}
      </div>

      {/* 4 Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendGrowthChart />
        <SentimentPieChart />
        <SourceDistChart />
        <CategoryDistChart />
      </div>

      {/* Latest Trends Table Section */}
      <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-6 shadow-xl">
        <LatestTrendsTable />
      </div>

      {/* Bottom Widgets Grid: Recent Alerts, Trending Keywords, Top Categories */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Alerts Widget */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#6366F1]" /> Recent Alerts
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">Latest volume & sentiment triggers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')} className="text-xs text-[#6366F1]">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_ALERTS.slice(0, 3).map((alert) => (
              <div key={alert.id} className="rounded-lg border border-[#1F2937] bg-[#0F172A]/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{alert.title}</span>
                  <Badge variant={alert.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                    {alert.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-[#94A3B8]">Query: "{alert.query}"</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Triggered {alert.triggerCount} times</span>
                  <span>{alert.lastTriggered}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Keywords Cloud */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#10B981]" /> High Velocity Keywords
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">Fastest growing search queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {MOCK_TRENDING_KEYWORDS.map((kw) => (
                <button
                  key={kw.text}
                  onClick={() => navigate('/search')}
                  className="group flex items-center space-x-1.5 rounded-lg border border-[#1F2937] bg-[#1E293B] px-3 py-1.5 text-xs text-[#94A3B8] hover:border-[#6366F1] hover:text-white transition-all"
                >
                  {kw.isHot && <Flame className="h-3 w-3 text-[#EF4444]" />}
                  <span>{kw.text}</span>
                  <span className="text-[10px] font-mono text-[#6366F1] font-bold">+{kw.weight}%</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories Widget */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#3B82F6]" /> Top Sector Growth
            </CardTitle>
            <CardDescription className="text-[#94A3B8] text-xs">Sector level signal breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_TOP_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/60 border border-[#1F2937]">
                <div className="flex items-center space-x-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
                  <span className="font-semibold text-xs text-white">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-[#94A3B8]">{cat.count} signals</span>
                  <span className="font-bold text-[#34D399]">{cat.growth}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
