import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className }) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const containerSizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 selection:bg-transparent', className)}>
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-tr from-[#6366F1] to-[#818CF8] shadow-lg shadow-[#6366F1]/30 transition-transform hover:scale-105',
          containerSizes[size]
        )}
      >
        <Sparkles className={cn('text-white animate-pulse', iconSizes[size])} />
      </div>
      {showText && (
        <span className={cn('tracking-tight text-[#F8FAFC] dark:text-white', textSizes[size])}>
          Pulse<span className="text-[#6366F1]">Pop</span>
        </span>
      )}
    </div>
  );
};
