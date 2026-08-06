import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, RefreshCw, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickActionsProps {
  onRefresh?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onRefresh }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <CardTitle className="text-sm font-bold text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs">
        <Link
          to="/trends"
          className="flex items-center gap-3 rounded-lg border border-[#1F2937] bg-[#0F172A]/60 p-2.5 text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#6366F1]/10 text-[#818CF8]">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">Explore Trends</p>
            <p className="text-[10px] text-[#64748B]">Search & filter active signals</p>
          </div>
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-lg border border-[#1F2937] bg-[#0F172A]/60 p-2.5 text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10B981]/10 text-[#10B981]">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">Account Profile</p>
            <p className="text-[10px] text-[#64748B]">Manage credentials & session</p>
          </div>
        </Link>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-full flex items-center gap-3 rounded-lg border border-[#1F2937] bg-[#0F172A]/60 p-2.5 text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F59E0B]/10 text-[#F59E0B]">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">Refresh Analytics</p>
              <p className="text-[10px] text-[#64748B]">Fetch latest backend data</p>
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  );
};
