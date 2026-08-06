import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 w-3/4 bg-[#1F2937]/50 rounded-xl" />

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-[#1F2937] bg-[#111827]/50 h-32">
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-1/2 bg-[#1F2937] rounded" />
              <div className="h-8 w-3/4 bg-[#1F2937] rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-80 bg-[#111827]/50 border border-[#1F2937] rounded-2xl p-4 space-y-4">
          <div className="h-6 w-1/3 bg-[#1F2937] rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-[#1F2937]/50 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-80 bg-[#111827]/50 border border-[#1F2937] rounded-2xl p-4 space-y-4">
          <div className="h-6 w-1/2 bg-[#1F2937] rounded" />
          <div className="h-16 w-full bg-[#1F2937]/50 rounded-lg" />
          <div className="h-16 w-full bg-[#1F2937]/50 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
