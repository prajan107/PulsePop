import { Activity, BarChart3, Compass, LayoutDashboard, User } from 'lucide-react';

export interface NavItem {
  title: string;
  path: string;
  icon: typeof LayoutDashboard;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Trend Explorer',
    path: '/trends',
    icon: Compass,
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Monitoring',
    path: '/monitoring',
    icon: Activity,
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: User,
  },
];
