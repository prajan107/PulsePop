import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#818CF8] mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-[#94A3B8] max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/profile">
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">
          <Home className="mr-2 h-4 w-4" /> Go to Profile
        </Button>
      </Link>
    </div>
  );
};
