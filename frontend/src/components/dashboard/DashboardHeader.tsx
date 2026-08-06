import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

interface DashboardHeaderProps {
  days?: number;
  onDaysChange?: (days: number | undefined) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ days, onDaysChange }) => {
  const { user } = useAuthStore();

  const timeOptions = [
    { label: 'All Time', value: undefined },
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2937]">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#6366F1]/10 px-3 py-1 text-xs font-semibold text-[#818CF8]">
          <Sparkles className="h-3.5 w-3.5 text-[#6366F1]" /> PulsePop Dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {user?.username || 'Analyst'}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Real-time aggregated trend analytics and sentiment intelligence.
        </p>
      </div>

      {onDaysChange && (
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-[#111827] border border-[#1F2937] p-1 text-xs">
          <Calendar className="h-4 w-4 text-[#64748B] ml-2 mr-1" />
          {timeOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onDaysChange(opt.value)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                days === opt.value
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1F2937]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
