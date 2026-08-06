import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ApiErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  title = 'Service Unavailable',
  message = 'Failed to load data from backend server. Please verify network connectivity.',
  onRetry,
  className,
}) => {
  return (
    <Card className={`border-[#EF4444]/30 bg-[#111827]/90 backdrop-blur-xl p-6 text-center ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">{message}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="border-[#1F2937] text-xs mt-2">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
