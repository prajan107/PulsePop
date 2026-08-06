import React from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyDashboardProps {
  onRefresh?: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onRefresh }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl p-8 text-center">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#818CF8]">
          <Database className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Analytics Available Yet</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            The data pipelines have not processed any trend clusters for the selected time window.
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Reload Data
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
