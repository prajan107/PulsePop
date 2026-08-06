import React from 'react';
import { LucideIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#6366F1]',
  isLoading = false,
  isError = false,
  errorMessage = 'Chart data unavailable',
  onRetry,
  action,
  children,
  className,
}) => {
  return (
    <Card className={cn('border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl', className)}>
      <CardHeader className="pb-2 border-b border-[#1F2937] flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            {Icon && <Icon className={cn('h-5 w-5', iconColor)} />}
            {title}
          </CardTitle>
          {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-4 h-72 flex items-center justify-center">
        {isLoading ? (
          <Spinner size="md" />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
            <AlertCircle className="h-6 w-6 text-[#EF4444]" />
            <p className="text-xs text-[#EF4444] font-medium">{errorMessage}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#818CF8] hover:underline pt-1"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};
