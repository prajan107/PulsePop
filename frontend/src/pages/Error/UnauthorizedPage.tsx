import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
        <Lock className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">401 - Unauthorized</h1>
      <p className="text-sm text-[#94A3B8] max-w-md mb-6">
        You need to be signed in to access this page. Please log in with your credentials.
      </p>
      <Link to="/login">
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
          <LogIn className="mr-2 h-4 w-4" /> Go to Sign In
        </Button>
      </Link>
    </div>
  );
};
