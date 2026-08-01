import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_CHART_DATA } from '@/mocks/mockData';

export const SourceDistChart: React.FC = () => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#F8FAFC]">Active Data Sources</CardTitle>
        <CardDescription className="text-xs text-[#94A3B8]">Mentions breakdown by platform</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_DATA.sourceDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis dataKey="source" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1F2937',
                  borderRadius: '10px',
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
                formatter={(val: number) => [`${val.toLocaleString()} mentions`, 'Volume']}
              />
              <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
