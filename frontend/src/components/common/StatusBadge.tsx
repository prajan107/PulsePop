import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Play, Square } from 'lucide-react';
import { cn } from '@/utils/cn';

export type StatusType =
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'running'
  | 'stopped'
  | 'failed'
  | 'active'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const normalized = (status || '').toLowerCase();

  let label = status;
  let Icon = CheckCircle2;
  let colorClasses = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';

  if (normalized === 'healthy' || normalized === 'active') {
    label = normalized === 'active' ? 'Active' : 'Healthy';
    Icon = CheckCircle2;
    colorClasses = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
  } else if (normalized === 'degraded') {
    label = 'Degraded';
    Icon = AlertTriangle;
    colorClasses = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
  } else if (normalized === 'running') {
    label = 'Running';
    Icon = Play;
    colorClasses = 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30';
  } else if (normalized === 'stopped') {
    label = 'Stopped';
    Icon = Square;
    colorClasses = 'bg-[#64748B]/10 text-[#94A3B8] border-[#64748B]/30';
  } else if (normalized === 'unhealthy' || normalized === 'failed') {
    label = normalized === 'failed' ? 'Failed' : 'Unhealthy';
    Icon = XCircle;
    colorClasses = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-md border',
        colorClasses,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
};
