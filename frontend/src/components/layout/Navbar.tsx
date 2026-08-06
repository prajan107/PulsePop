import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTheme } from '@/providers/ThemeProvider';
import { LogoutModal } from '@/components/common/LogoutModal';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#0F172A]/80 backdrop-blur-md dark:bg-[#0F172A]/80 dark:border-[#1F2937] light:bg-white/80 light:border-slate-200 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center" aria-label="PulsePop Dashboard Home">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Current theme: ${theme}. Click to change.`}
              className="text-[#94A3B8] hover:text-white dark:hover:text-white light:hover:text-slate-900"
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-[#F59E0B]" />
              ) : (
                <Moon className="h-5 w-5 text-[#6366F1]" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366F1]/20 text-[#818CF8]">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline-block">{user.username}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLogoutOpen(true)}
                  className="text-xs text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                >
                  <LogOut className="mr-1.5 h-4 w-4" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
