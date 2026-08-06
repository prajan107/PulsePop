import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">500 - Internal Server Error</h1>
      <p className="text-sm text-[#94A3B8] max-w-md mb-6">
        Something went wrong on our end. Please try refreshing the page or try again later.
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
      </Button>
    </div>
  );
};
