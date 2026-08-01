import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_CHART_DATA } from '@/mocks/mockData';

export const CategoryDistChart: React.FC = () => {
  const total = MOCK_CHART_DATA.categoryDistribution.reduce((acc, c) => acc + c.count, 0);

  return (
    <Card className="border-[#1F2937] bg-[#111827]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#F8FAFC]">Top Categories</CardTitle>
        <CardDescription className="text-xs text-[#94A3B8]">Cluster distribution across sectors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {MOCK_CHART_DATA.categoryDistribution.map((item) => {
          const percent = Math.round((item.count / total) * 100);
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#F8FAFC]">{item.category}</span>
                <span className="text-[#94A3B8] font-semibold">{item.count} trends ({percent}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E293B]">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percent}%`, backgroundColor: item.color }} 
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
