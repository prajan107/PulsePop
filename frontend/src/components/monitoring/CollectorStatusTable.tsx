import React from 'react';
import { Database } from 'lucide-react';
import { SystemMetrics } from '@/features/monitoring/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';

interface CollectorStatusTableProps {
  metrics: SystemMetrics;
}

export const CollectorStatusTable: React.FC<CollectorStatusTableProps> = ({ metrics }) => {
  const collectors = [
    { name: 'Reddit Collector', type: 'REST API', target: 'r/all / tech subreddits', status: 'Active' },
    { name: 'News API Collector', type: 'NewsFeed', target: 'Global Tech RSS', status: 'Active' },
    { name: 'YouTube Trends Collector', type: 'V3 Data API', target: 'Trending Videos', status: 'Active' },
    { name: 'Google Trends Collector', type: 'SerpAPI / PyTrends', target: 'Search Term Velocity', status: 'Active' },
  ];

  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-[#818CF8]" /> Collector Pipeline Engine
        </CardTitle>
        <p className="text-xs text-[#94A3B8]">
          Total Requests: <span className="font-mono text-white">{metrics.collectors.requests}</span> | Failures: <span className="font-mono text-[#EF4444]">{metrics.collectors.failures}</span>
        </p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs text-[#CBD5E1]">
          <thead className="bg-[#0F172A]/70 text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#1F2937]">
            <tr>
              <th scope="col" className="px-4 py-3">Collector Name</th>
              <th scope="col" className="px-4 py-3">Protocol</th>
              <th scope="col" className="px-4 py-3">Target Endpoint</th>
              <th scope="col" className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {collectors.map((col) => (
              <tr key={col.name} className="hover:bg-[#1F2937]/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">
                  {col.name}
                </td>
                <td className="px-4 py-3 font-mono text-[#94A3B8]">
                  {col.type}
                </td>
                <td className="px-4 py-3 text-[#CBD5E1]">
                  {col.target}
                </td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge status={col.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
