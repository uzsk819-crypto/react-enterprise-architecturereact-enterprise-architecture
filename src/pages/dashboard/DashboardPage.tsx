import React, { useState } from 'react';
import {
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Shield,
  Box,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const stats = [
    {
      title: 'Active Accounts',
      value: '2,845',
      trend: '+12.4% from last month',
      icon: Users,
    },
    {
      title: 'Architecture Score',
      value: '99.8%',
      trend: 'Strict TypeScript & Zero any',
      icon: Layers,
    },
    {
      title: 'Avg Query Latency',
      value: '24ms',
      trend: 'TanStack Query Caching',
      icon: Zap,
    },
    {
      title: 'Active Theme Tokens',
      value: '18 Vars',
      trend: 'Instant Dynamic Switching',
      icon: Sparkles,
    },
  ];

  const architectureHighlights = [
    {
      title: 'Centralized Reusable UI Components',
      description:
        'Independently organized components (Button, Input, Select, Modal, Table, Card, Badge, Spinner) with dedicated types and styles.',
      tag: 'Modular UI',
    },
    {
      title: 'Centralized Reusable Custom Hooks',
      description:
        'Built-in hooks for useDebounce, usePagination, useLocalStorage, useClickOutside, useMediaQuery, useTheme, useAuth, and usePermissions.',
      tag: 'Hooks Layer',
    },
    {
      title: 'Centralized API Management',
      description:
        'Axios client with interceptors, AbortSignal request cancellation, error mapping, query key factories, and typed service files.',
      tag: 'TanStack Query',
    },
    {
      title: 'Dynamic Theme System',
      description:
        'Global CSS variables seamlessly mapped into Tailwind CSS, supporting light, dark, system modes, and brand palette swaps.',
      tag: 'Design System',
    },
    {
      title: 'Enterprise Routing & Guards',
      description:
        'React Router nested routes, public/protected routes, lazy code-splitting, role checks, and 404/403 handlers.',
      tag: 'Security & RBAC',
    },
    {
      title: 'Multi-Project Reusability',
      description:
        'Core architecture is cleanly detached from project-specific pages for rapid reuse across enterprise applications.',
      tag: 'Scalable Core',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-500/10 via-surface to-surface p-6 rounded-theme border border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Welcome back, {user?.name || 'Architect'}
            </h1>
            <Badge variant="primary" size="sm">
              {user?.role?.toUpperCase() || 'ADMIN'}
            </Badge>
          </div>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            This dashboard demonstrates the production-ready React + TypeScript frontend architecture
            following senior architectural guidelines and modern enterprise design patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDemoModalOpen(true)}
            leftIcon={<Box className="h-4 w-4" />}
          >
            Launch Reusable Modal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open('https://github.com', '_blank')}
            rightIcon={<ArrowUpRight className="h-4 w-4" />}
          >
            Architecture Guide
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} hoverable>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-text-muted">{stat.title}</span>
                <div className="h-8 w-8 rounded-theme bg-primary-50 dark:bg-primary-900/30 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-text-primary">{stat.value}</div>
              <p className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                <Activity className="h-3 w-3 text-success" />
                {stat.trend}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Architecture Highlights Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-text-primary">Architectural Pillars</h2>
          <p className="text-xs text-text-muted">
            Designed according to strict enterprise constraints: simple, lightweight, unbloated, and modular where it counts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureHighlights.map((item) => (
            <Card key={item.title} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" size="sm">
                    {item.tag}
                  </Badge>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-1.5">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-4 border-t border-border mt-4 text-[11px] font-medium text-primary flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Production Standard</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reusable Modal Demonstration */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Reusable Modal Component"
        description="Demonstrating modal portal rendering, focus management, and accessibility."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            This modal is built with React Portals (<code>createPortal</code>), full ARIA dialog attributes,
            body scroll lock cleanup, keyboard Escape listener, and click-outside detection via our centralized <code>useClickOutside</code> hook.
          </p>
          <div className="p-3 rounded-theme bg-surface-hover border border-border text-xs">
            <strong>Key Benefit:</strong> Zero external UI component library dependency required. Fully customizable via Tailwind CSS variables.
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default DashboardPage;
