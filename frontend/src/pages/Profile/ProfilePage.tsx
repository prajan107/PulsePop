import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Key,
  LogOut,
  RefreshCw,
  Shield,
  User as UserIcon,
  Wifi,
} from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useMonitoringHealth } from '@/features/monitoring/monitoringQueries';
import { LogoutModal } from '@/components/common/LogoutModal';
import { toast } from '@/components/common/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isError, refetch } = useCurrentUser();
  const { accessToken, logout } = useAuthStore();
  const { data: health, isError: isHealthError } = useMonitoringHealth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const isConnected = !isHealthError && health?.database?.status === 'healthy';

  const getJwtExpiration = (token: string | null): string => {
    if (!token) return 'Active Session';
    try {
      const parts = token.split('.');
      if (parts.length < 2) return 'Active Session';
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp) {
        return new Date(payload.exp * 1000).toLocaleString();
      }
    } catch {
      return 'Active Session';
    }
    return 'Active Session';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Profile and session status refreshed successfully.');
    } catch {
      toast.error('Failed to refresh profile details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutOpen(false);
    toast.info('Logged out of session.');
    navigate('/login');
  };

  if (isLoading && !user) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-16 w-3/4 bg-[#1F2937]/50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-80 bg-[#111827]/50 rounded-2xl" />
          <Skeleton className="h-80 bg-[#111827]/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2937]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              User Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              View authenticated account details and active security session status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              onClick={handleRefresh}
              className="border-[#1F2937] text-xs text-[#CBD5E1] h-9"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutOpen(true)}
              className="border-[#EF4444]/30 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 h-9"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>

        {isError && (
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 text-xs text-[#EF4444]">
            Failed to fetch updated profile details from backend server.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Information Card */}
          <Card className="md:col-span-2 border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-[#1F2937]">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-[#6366F1]" /> Account Information
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Authenticated user details synchronized with backend identity repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A]/70 border border-[#1F2937]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] text-white font-bold text-lg shadow-md shadow-[#6366F1]/30 shrink-0">
                  {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate">{user?.username}</h3>
                  <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0F172A]/60 border border-[#1F2937] space-y-1">
                  <span className="text-[#64748B] font-semibold block">User ID</span>
                  <span className="text-white font-mono text-sm font-bold">#{user?.id}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0F172A]/60 border border-[#1F2937] space-y-1">
                  <span className="text-[#64748B] font-semibold block">Account Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#10B981]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0F172A]/60 border border-[#1F2937] space-y-1">
                  <span className="text-[#64748B] font-semibold block">Role Privilege</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#818CF8]">
                    <Shield className="h-3.5 w-3.5 text-[#6366F1]" />
                    {user?.is_superuser ? 'Admin Superuser' : 'Standard User'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0F172A]/60 border border-[#1F2937] space-y-1">
                  <span className="text-[#64748B] font-semibold block">Backend Service Status</span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      isConnected ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    <Wifi className="h-3.5 w-3.5" />
                    {isConnected ? '🟢 Connected' : '🔴 Offline'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Status Card (NO RAW TOKEN EXPOSED) */}
          <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-[#1F2937]">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-[#10B981]" /> Session Status
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Active security session metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> Logged In
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                  <span className="text-[#64748B] font-semibold">Auth Method</span>
                  <span className="font-semibold text-white">JWT Bearer</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                  <span className="text-[#64748B] font-semibold">Session Status</span>
                  <span className="font-bold text-[#10B981]">Active</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                  <span className="text-[#64748B] font-semibold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#38BDF8]" /> Session Expires
                  </span>
                  <span className="font-mono text-[#38BDF8] text-[11px]">
                    {getJwtExpiration(accessToken)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#64748B] pt-1 leading-relaxed">
                Security tokens are encrypted and handled automatically via Authorization headers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
