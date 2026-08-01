import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_CHART_DATA } from '@/mocks/mockData';

export const TrendGrowthChart: React.FC = () => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-[#F8FAFC]">Trend Velocity Growth</CardTitle>
          <CardDescription className="text-xs text-[#94A3B8]">30-Day cross-category volume trajectory</CardDescription>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
            <span className="text-[#94A3B8]">AI & ML</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="text-[#94A3B8]">SaaS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
            <span className="text-[#94A3B8]">Dev Tools</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA.growthLine} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaaS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#1F2937', 
                  borderRadius: '10px', 
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="AI & ML" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" />
              <Area type="monotone" dataKey="SaaS" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSaaS)" />
              <Area type="monotone" dataKey="Developer Tools" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorDev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
