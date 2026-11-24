import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const AuthLayout: React.FC = () => {
  const { resolvedMode, toggleMode } = useTheme();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-background text-text-primary selection:bg-primary selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Quick Theme Switcher */}
      <div className="absolute top-6 right-6">
        <button
          type="button"
          onClick={toggleMode}
          aria-label="Toggle dark mode"
          className="p-2.5 rounded-theme bg-surface border border-border shadow-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          {resolvedMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <Outlet />
      </div>
    </div>
  );
};
