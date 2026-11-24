import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Sun,
  Moon,
  Laptop,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import type { BrandColor } from '../../types/theme.types';

const navItems = [
  {
    name: 'Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'User Management',
    path: ROUTE_PATHS.USERS,
    icon: Users,
  },
  {
    name: 'Settings & Theme',
    path: ROUTE_PATHS.SETTINGS,
    icon: Settings,
  },
];

const brandOptions: { label: string; value: BrandColor; bg: string }[] = [
  { label: 'Indigo', value: 'indigo', bg: 'bg-[#4f46e5]' },
  { label: 'Blue', value: 'blue', bg: 'bg-[#2563eb]' },
  { label: 'Emerald', value: 'emerald', bg: 'bg-[#059669]' },
  { label: 'Violet', value: 'violet', bg: 'bg-[#7c3aed]' },
  { label: 'Rose', value: 'rose', bg: 'bg-[#e11d48]' },
];

const getModuleInfo = (pathname: string) => {
  if (pathname.startsWith(ROUTE_PATHS.USERS)) {
    return {
      title: 'User Management',
      subtitle: 'Directory & Access Control',
      icon: Users,
    };
  }
  if (pathname.startsWith(ROUTE_PATHS.SETTINGS)) {
    return {
      title: 'Settings & Theme',
      subtitle: 'Branding & Token System',
      icon: Settings,
    };
  }
  return {
    title: 'Dashboard',
    subtitle: 'System Metrics & Status',
    icon: LayoutDashboard,
  };
};

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { mode, setMode, resolvedMode, brand, setBrand } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentModule = getModuleInfo(location.pathname);
  const CurrentModuleIcon = currentModule.icon;

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-theme text-text-secondary hover:bg-surface-hover"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
            >
              <div className="h-9 w-9 rounded-theme bg-primary flex items-center justify-center text-white font-black shadow-md">
                EA
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-text-primary">
                  Enterprise Arch
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
                  v1.0
                </span>
              </div>
            </div>

            {/* Active Module Header Label inserted directly into Main Header */}
            <div className="hidden sm:flex items-center gap-2.5 pl-4 ml-1 border-l border-border">
              <span className="text-text-muted/60 text-sm font-light">/</span>
              <div className="flex items-center gap-2 bg-surface-hover/80 px-2.5 py-1 rounded-theme border border-border">
                <CurrentModuleIcon className="h-4 w-4 text-primary" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-text-primary">
                    {currentModule.title}
                  </span>
                  <span className="text-[10px] text-text-muted hidden md:inline">
                    • {currentModule.subtitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Controls: Quick Brand Switcher, Theme Mode, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Brand Palette Dots */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-surface-hover border border-border">
              <Palette className="h-3.5 w-3.5 text-text-muted ml-1" />
              {brandOptions.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBrand(b.value)}
                  title={`Switch brand to ${b.label}`}
                  className={cn(
                    'h-4 w-4 rounded-full transition-transform',
                    b.bg,
                    brand === b.value
                      ? 'ring-2 ring-primary ring-offset-1 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  )}
                />
              ))}
            </div>

            {/* Theme Toggle (Light / Dark / System) */}
            <div className="flex items-center rounded-theme bg-surface-hover border border-border p-1">
              <button
                type="button"
                onClick={() => setMode('light')}
                className={cn(
                  'p-1.5 rounded-theme transition-colors',
                  mode === 'light'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                )}
                title="Light Theme"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={cn(
                  'p-1.5 rounded-theme transition-colors',
                  mode === 'dark'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                )}
                title="Dark Theme"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMode('system')}
                className={cn(
                  'p-1.5 rounded-theme transition-colors',
                  mode === 'system'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                )}
                title={`System Theme (${resolvedMode})`}
              >
                <Laptop className="h-4 w-4" />
              </button>
            </div>

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-text-primary">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-text-muted capitalize">{user.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Logout"
                  className="px-2 text-text-muted hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            'fixed inset-y-16 left-0 z-30 w-64 border-r border-border bg-surface transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full justify-between p-4">
            <div className="space-y-6">
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  Main Navigation
                </p>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Architecture Info Widget */}
              <div className="rounded-theme bg-surface-hover/80 border border-border p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-1">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Architecture Status</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Clean, modular, enterprise-ready React 18 + TypeScript core.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="primary" size="sm">Zustand</Badge>
                  <Badge variant="secondary" size="sm">TanStack Query</Badge>
                  <Badge variant="outline" size="sm">Tailwind CSS</Badge>
                </div>
              </div>
            </div>

            {/* User Session Footer */}
            {user && (
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted truncate">Logged in as {user.email}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area - Optimized compact padding */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
