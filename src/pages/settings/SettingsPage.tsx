import React from 'react';
import { Palette, Sun, Moon, Laptop, Sliders, Shield, Key } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import type { BrandColor, BorderRadius, ThemeMode } from '../../types/theme.types';

export const SettingsPage: React.FC = () => {
  const { mode, setMode, resolvedMode, brand, setBrand, radius, setRadius } = useTheme();
  const { user } = useAuth();

  const brandOptions: { label: string; value: BrandColor; bg: string; desc: string }[] = [
    { label: 'Indigo', value: 'indigo', bg: 'bg-[#4f46e5]', desc: 'Tech & Modern' },
    { label: 'Blue', value: 'blue', bg: 'bg-[#2563eb]', desc: 'Classic Corporate' },
    { label: 'Emerald', value: 'emerald', bg: 'bg-[#059669]', desc: 'Health & Finance' },
    { label: 'Violet', value: 'violet', bg: 'bg-[#7c3aed]', desc: 'Creative & SaaS' },
    { label: 'Rose', value: 'rose', bg: 'bg-[#e11d48]', desc: 'Vibrant & Bold' },
  ];

  const radiusOptions: { label: string; value: BorderRadius; preview: string }[] = [
    { label: 'Square (None)', value: 'none', preview: 'rounded-none' },
    { label: 'Small (4px)', value: 'sm', preview: 'rounded-sm' },
    { label: 'Medium (8px)', value: 'md', preview: 'rounded-md' },
    { label: 'Large (12px)', value: 'lg', preview: 'rounded-lg' },
    { label: 'Full (Pill)', value: 'full', preview: 'rounded-full' },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Settings & Dynamic Theme System
        </h1>
        <p className="text-xs text-text-muted">
          All theme customizations modify root CSS variables. No component edits needed.
        </p>
      </div>

      {/* Theme Mode Customizer */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Display Mode</CardTitle>
          </div>
          <CardDescription>
            Choose between light, dark, or automatic system-synchronized color modes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                modeValue: 'light' as ThemeMode,
                label: 'Light Mode',
                desc: 'Clean and bright aesthetic',
                icon: Sun,
              },
              {
                modeValue: 'dark' as ThemeMode,
                label: 'Dark Mode',
                desc: 'Reduced eye strain in low-light',
                icon: Moon,
              },
              {
                modeValue: 'system' as ThemeMode,
                label: 'System Sync',
                desc: `Matches OS preference (${resolvedMode})`,
                icon: Laptop,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = mode === item.modeValue;
              return (
                <button
                  key={item.modeValue}
                  type="button"
                  onClick={() => setMode(item.modeValue)}
                  className={cn(
                    'flex flex-col items-start p-4 rounded-theme border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary-50/50 dark:bg-primary-900/20 ring-1 ring-primary'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5 mb-2', isSelected ? 'text-primary' : 'text-text-muted')}
                  />
                  <div className="text-sm font-bold text-text-primary">{item.label}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Brand Color Customizer */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <CardTitle>Primary Brand Palette</CardTitle>
          </div>
          <CardDescription>
            Switch brand accents dynamically. Instant global update via <code>[data-brand]</code> CSS variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {brandOptions.map((item) => {
              const isSelected = brand === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setBrand(item.value)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-theme border text-center transition-all',
                    isSelected
                      ? 'border-primary bg-primary-50/50 dark:bg-primary-900/20 ring-1 ring-primary'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  )}
                >
                  <span className={cn('h-6 w-6 rounded-full mb-2 shadow-xs', item.bg)} />
                  <span className="text-xs font-bold text-text-primary">{item.label}</span>
                  <span className="text-[10px] text-text-muted mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Border Radius Customizer */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius Token</CardTitle>
          <CardDescription>
            Controls the curvature of buttons, inputs, modals, and cards via <code>--border-radius</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {radiusOptions.map((item) => {
              const isSelected = radius === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRadius(item.value)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-theme border text-center transition-all',
                    isSelected
                      ? 'border-primary bg-primary-50/50 dark:bg-primary-900/20 ring-1 ring-primary'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-12 border-2 border-primary bg-primary/20 mb-2',
                      item.preview
                    )}
                  />
                  <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Component Preview */}
      <Card className="border-primary/40 bg-gradient-to-br from-surface to-surface-hover">
        <CardHeader>
          <CardTitle>Live Token Verification Preview</CardTitle>
          <CardDescription>
            Observe how button styles, inputs, badges, and cards automatically respond to current theme variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>Primary</Badge>
            <Badge variant="success" dot>Success</Badge>
            <Badge variant="warning" dot>Warning</Badge>
            <Badge variant="danger" dot>Danger</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="max-w-md">
            <Input
              label="Interactive Theme Input"
              placeholder="Focus to see dynamic theme glow..."
              helperText="Focus ring uses var(--color-primary)"
            />
          </div>
        </CardContent>
      </Card>

      {/* RBAC Session Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Session Security & Permissions</CardTitle>
          </div>
          <CardDescription>
            Current authenticated identity and assigned security claims.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-text-muted">Account Identity</span>
              <span className="font-semibold text-text-primary">{user?.name} ({user?.email})</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-text-muted">Assigned Role</span>
              <Badge variant="primary" size="sm">{user?.role?.toUpperCase()}</Badge>
            </div>
            <div className="py-2">
              <span className="text-text-muted block mb-2">Granted RBAC Permissions</span>
              <div className="flex flex-wrap gap-1.5">
                {user?.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-theme bg-surface-hover border border-border text-[11px] font-mono text-text-secondary"
                  >
                    <Key className="h-3 w-3 text-primary" />
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default SettingsPage;
