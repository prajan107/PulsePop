import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, endIcon, showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === 'password';
    const computedType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={computedType}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[#1F2937] bg-[#0F172A]/70 px-3 py-2 text-sm text-[#F8FAFC] placeholder-[#64748B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0F172A]/70 dark:text-[#F8FAFC]',
            icon && 'pl-10',
            (endIcon || (isPasswordType && showPasswordToggle)) && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : (
          endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {endIcon}
            </div>
          )
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
