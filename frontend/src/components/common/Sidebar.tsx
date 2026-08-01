import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { MOCK_USER } from '@/mocks/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Trends', path: '/trends/trend-1', icon: TrendingUp },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Alerts', path: '/alerts', icon: Bell, badge: '4' },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onNavigate) onNavigate();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "flex h-full w-64 flex-col justify-between border-r border-[#1F2937] bg-[#0F172A] p-4 text-[#F8FAFC]",
      className
    )}>
      <div className="space-y-6">
        {/* Logo */}
        <div 
          onClick={() => { navigate('/'); if (onNavigate) onNavigate(); }}
          className="flex cursor-pointer items-center space-x-3 px-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] shadow-lg shadow-[#6366F1]/30">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-white">PulsePop</span>
              <Badge variant="default" className="bg-[#6366F1]/20 text-[#818CF8] border-0 text-[10px] px-1.5 py-0">v1.0</Badge>
            </div>
            <p className="text-[11px] font-medium text-[#94A3B8]">AI Trend Intelligence</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Menu</p>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#6366F1]/15 text-white border border-[#6366F1]/30 shadow-sm"
                        : "text-[#94A3B8] hover:bg-[#1E293B]/70 hover:text-[#F8FAFC]"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <Icon className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-[#6366F1]" : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                        )} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366F1] text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="h-4 w-4 text-[#6366F1]" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile & Logout Section */}
      <div className="border-t border-[#1F2937] pt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#111827] p-2.5 border border-[#1F2937]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Avatar className="h-9 w-9 border border-[#374151]">
              <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="truncate text-sm font-semibold text-[#F8FAFC]">{MOCK_USER.name}</p>
              <p className="truncate text-xs text-[#94A3B8]">{MOCK_USER.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#EF4444] transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
