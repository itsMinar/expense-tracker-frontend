'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  Settings,
  Tags,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/expenses', label: 'Expenses', icon: Wallet },
  { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
  { href: '/dashboard/categories', label: 'Categories', icon: Tags },
  { href: '/dashboard/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLogoutLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed top-4 right-4 z-40 rounded-lg p-2 bg-background border shadow-sm ${
          mobileOpen ? 'hidden' : 'lg:hidden'
        }`}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-card flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-lg"
          >
            <Wallet className="h-5 w-5 text-primary" />
            Trackr
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <div className="rounded-xl bg-muted/50 px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-center rounded-lg bg-background/60 hover:bg-background transition-colors px-2 py-1.5">
                <ThemeToggle />
                <span className="text-xs text-muted-foreground ml-1.5">
                  Theme
                </span>
              </div>
              <button
                onClick={() => logout()}
                disabled={isLogoutLoading}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-background/60 hover:bg-red-500/10 hover:text-red-500 transition-colors px-2 py-1.5 text-xs text-muted-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
