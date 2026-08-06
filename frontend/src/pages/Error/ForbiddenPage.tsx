import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">403 - Forbidden</h1>
      <p className="text-sm text-[#94A3B8] max-w-md mb-6">
        You do not have administrative permissions to view this resource.
      </p>
      <Link to="/profile">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
        </Button>
      </Link>
    </div>
  );
};
