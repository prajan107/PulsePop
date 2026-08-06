import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const TrendSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#1F2937] bg-[#111827]/50 p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-[#1F2937]/50">
              <div className="h-4 w-8 bg-[#1F2937] rounded" />
              <div className="h-4 w-1/3 bg-[#1F2937] rounded" />
              <div className="h-6 w-16 bg-[#1F2937] rounded-md" />
              <div className="h-4 w-12 bg-[#1F2937] rounded" />
              <div className="h-6 w-20 bg-[#1F2937] rounded-md" />
              <div className="h-6 w-24 bg-[#1F2937] rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-[#1F2937] bg-[#111827]/50 h-44">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-16 bg-[#1F2937] rounded" />
                <div className="h-5 w-20 bg-[#1F2937] rounded" />
              </div>
              <div className="h-6 w-3/4 bg-[#1F2937] rounded" />
              <div className="h-10 w-full bg-[#1F2937]/50 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
