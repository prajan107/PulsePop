import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/ui/logo';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-[#0F172A] space-y-4">
      <Logo size="lg" />
      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
        <Spinner size="md" /> Loading page assets...
      </div>
    </div>
  );
};
