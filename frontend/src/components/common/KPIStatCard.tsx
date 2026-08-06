import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface KPIStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#6366F1]',
  badge,
  badgeVariant = 'neutral',
  className,
}) => {
  return (
    <Card className={cn('border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl hover:border-[#374151] transition-all', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#94A3B8]">{title}</span>
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F172A]', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </span>
          {badge && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold',
                badgeVariant === 'success' && 'bg-[#10B981]/10 text-[#10B981]',
                badgeVariant === 'warning' && 'bg-[#F59E0B]/10 text-[#F59E0B]',
                badgeVariant === 'danger' && 'bg-[#EF4444]/10 text-[#EF4444]',
                badgeVariant === 'neutral' && 'bg-[#6366F1]/10 text-[#818CF8]'
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-[11px] text-[#64748B] truncate">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
