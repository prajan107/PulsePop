import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, User } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <aside className="w-64 shrink-0 border-r border-[#1F2937] bg-[#111827]/50 p-4 hidden md:block min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Navigation
          </h3>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-[#6366F1]/10 text-[#818CF8] border-l-2 border-[#6366F1]'
                        : 'text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#F8FAFC]'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {user && (
          <div className="rounded-xl border border-[#1F2937] bg-[#0F172A]/70 p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366F1]/20 text-[#818CF8]">
                <User className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.username}</p>
                <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
              </div>
            </div>
            {user.is_superuser && (
              <div className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-semibold text-[#10B981]">
                <ShieldCheck className="h-3 w-3" /> Admin Superuser
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
