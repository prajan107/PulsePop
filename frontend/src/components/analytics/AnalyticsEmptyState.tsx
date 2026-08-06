import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsEmptyStateProps {
  onRefresh?: () => void;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({ onRefresh }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 p-8 text-center">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#818CF8]">
          <BarChart3 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Analytics Insights Available</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Statistical data for topics, sentiment, and sources has not been computed yet.
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Analytics
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
