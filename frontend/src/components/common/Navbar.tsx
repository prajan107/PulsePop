import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu, 
  Command, 
  Check, 
  User, 
  Settings as SettingsIcon, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MOCK_USER, MOCK_NOTIFICATIONS } from '@/mocks/mockData';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isDark, setIsDark] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#1F2937] bg-[#0F172A]/90 px-4 md:px-6 backdrop-blur-md">
      {/* Mobile Drawer & Search Trigger */}
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#0F172A] border-[#1F2937] w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Global Search Bar */}
        <div 
          onClick={() => {
            if (onOpenSearch) onOpenSearch();
            else navigate('/search');
          }}
          className="relative hidden sm:flex w-72 md:w-96 cursor-pointer items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827]/80 px-3 py-1.5 text-sm text-[#94A3B8] hover:border-[#374151] transition-all"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-[#6366F1]" />
            <span>Search trends, keywords, categories...</span>
          </div>
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-[#1F2937] bg-[#1E293B] px-1.5 text-[10px] font-mono text-[#94A3B8]">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Mobile Search Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/search')}
          className="sm:hidden text-[#94A3B8] hover:text-white"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          title="Toggle theme"
          className="text-[#94A3B8] hover:text-white"
        >
          {isDark ? <Moon className="h-5 w-5 text-[#818CF8]" /> : <Sun className="h-5 w-5 text-amber-400" />}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-[#94A3B8] hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444] opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#EF4444]"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 border-[#1F2937] bg-[#111827] text-[#F8FAFC]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#1F2937]">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#6366F1] hover:underline flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#1F2937]">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.link) navigate(item.link);
                  }}
                  className={`p-3 text-xs cursor-pointer transition-colors hover:bg-[#1E293B] ${
                    !item.read ? 'bg-[#6366F1]/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-[10px] text-[#94A3B8]">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-[#94A3B8] line-clamp-2">{item.message}</p>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-[#1F2937]" />
            <DropdownMenuItem 
              onClick={() => navigate('/alerts')}
              className="justify-center text-xs text-[#6366F1] font-medium"
            >
              View All Alerts & Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
              <Avatar className="h-8 w-8 border border-[#374151]">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[#1F2937] bg-[#111827]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-white">{MOCK_USER.name}</p>
                <p className="text-xs text-[#94A3B8] truncate">{MOCK_USER.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1F2937]" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-[#94A3B8]" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4 text-[#94A3B8]" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1F2937]" />
            <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer text-[#EF4444] focus:text-[#EF4444]">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
