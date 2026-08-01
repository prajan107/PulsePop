import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_TRENDS } from '@/mocks/mockData';
import { formatNumber } from '@/utils/cn';

export const LatestTrendsTable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#F8FAFC]">Latest High-Velocity Trends</h3>
          <p className="text-xs text-[#94A3B8]">Real-time emerging technologies & SaaS signals</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/search')}
          className="text-xs border-[#1F2937] hover:bg-[#1F2937]"
        >
          View All Trends <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trend Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Growth Rate</TableHead>
            <TableHead>Sentiment Score</TableHead>
            <TableHead>Mention Volume</TableHead>
            <TableHead>Sources</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_TRENDS.map((trend) => (
            <TableRow 
              key={trend.id}
              onClick={() => navigate(`/trends/${trend.id}`)}
              className="cursor-pointer transition-colors hover:bg-[#1E293B]/80"
            >
              <TableCell className="font-semibold text-white">
                <div className="flex items-center space-x-2">
                  <span>{trend.title}</span>
                  {trend.isHot && (
                    <Badge variant="default" className="bg-[#EF4444]/15 text-[#F87171] border-0 text-[10px] px-1.5 py-0 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> HOT
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-[#1E293B] text-[#94A3B8] border-[#374151]">
                  {trend.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1 font-bold text-[#34D399]">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+{trend.growthPercentage}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-[#1E293B]">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#818CF8] to-[#10B981]" 
                      style={{ width: `${trend.sentimentScore}%` }} 
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#F8FAFC]">{trend.sentimentScore}/100</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-[#94A3B8]">
                {formatNumber(trend.volume)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {trend.sources.map((s) => (
                    <span 
                      key={s} 
                      className="rounded bg-[#1E293B] px-1.5 py-0.5 text-[10px] text-[#94A3B8] border border-[#374151]/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94A3B8] hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
