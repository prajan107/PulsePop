import React from 'react';
import { cn } from '@/utils/cn';

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="block text-xs font-semibold text-[#94A3B8] dark:text-[#94A3B8]">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-[#EF4444] animate-in fade-in-50">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  );
};
