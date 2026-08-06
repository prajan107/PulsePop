import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const MonitoringSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 w-3/4 bg-[#1F2937]/50 rounded-xl" />

      <div className="h-28 bg-[#111827]/50 border border-[#1F2937] rounded-2xl p-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-[#1F2937] bg-[#111827]/50 h-28">
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-1/2 bg-[#1F2937] rounded" />
              <div className="h-7 w-3/4 bg-[#1F2937] rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-[#111827]/50 border border-[#1F2937] rounded-2xl p-4" />
        <div className="h-64 bg-[#111827]/50 border border-[#1F2937] rounded-2xl p-4" />
      </div>
    </div>
  );
};
