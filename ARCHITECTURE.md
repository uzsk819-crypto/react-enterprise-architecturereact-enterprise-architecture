# Frontend Architecture Specification & Standards Guide

This document details the architectural decisions, design guidelines, and patterns implemented in this codebase.

---

## 1. Architectural Principles

### 1.1 Simplicity & Pragmatic Modularity
We intentionally reject the overhead of micro-modular feature layers where every tiny feature requires its own state, api, hooks, and components folders. Instead:
- **Centralized Infrastructure**: All API clients, query key factories, routes, hooks, utilities, and types remain centralized and unified.
- **Independent UI Primitives**: Only presentation components (`components/ui/*`) and reusable business hooks (`hooks/*`) are modularized.
- **Clean Pages**: Pages act as orchestrators, combining UI components with centralized hooks and services.

### 1.2 Separation of Concerns
```
┌────────────────────────────────────────────────────────┐
│                      Pages                             │
│   (Orchestrates components, hooks, and user intents)   │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       ┌────────▼────────┐      ┌────────▼────────┐
       │   Reusable UI   │      │ Custom Hooks &  │
       │   Components    │      │ Global Stores   │
       └─────────────────┘      └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │ API Services &  │
                                │ TanStack Query  │
                                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │ Central Axios & │
                                │ Interceptors    │
                                └─────────────────┘
```

---

## 2. Component Design Standards

Each reusable UI component in `components/ui/` adheres to the following contract:

1. **Independent Folder**:
   - `ComponentName.tsx`: Main component code.
   - `componentName.types.ts`: TypeScript interfaces and prop types.
   - `componentName.styles.ts`: Class definitions and variant mappings (when applicable).
   - `index.ts`: Public API export.

2. **Core Capabilities**:
   - **Forward Ref**: Wrapped with `React.forwardRef` to allow integration with form libraries (such as React Hook Form) and focus management.
   - **Accessibility**: Explicit `aria-*` tags, keyboard navigation (`Escape`, `Enter`, `Tab`), and focus-visible outlines.
   - **Customizability**: Accepts `className` and joins classes using `cn()` (Tailwind Merge + Clsx).
   - **Loading & Disabled States**: Handles interactive suppression and visual loading spinners (`aria-busy`).

---

## 3. Dynamic Theme System Architecture

### 3.1 CSS Variables Strategy
Rather than hardcoding hex codes in Tailwind or CSS files, all semantic colors reference CSS variables:
```css
/* src/styles/theme.css */
:root {
  --color-primary: #4f46e5;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text-primary: #0f172a;
}

[data-theme="dark"] {
  --color-bg: #090d16;
  --color-surface: #111827;
  --color-border: #1f2937;
  --color-text-primary: #f8fafc;
}

[data-brand="emerald"] {
  --color-primary: #059669;
}
```

### 3.2 Tailwind Integration
Tailwind uses these variables via `tailwind.config.js`:
```javascript
colors: {
  primary: 'var(--color-primary)',
  background: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
}
```

### 3.3 Theme Store
The Zustand `themeStore` applies these attributes to `document.documentElement`:
- `data-theme`: `light` | `dark`
- `data-brand`: `indigo` | `blue` | `emerald` | `violet` | `rose`
- `data-radius`: `none` | `sm` | `md` | `lg` | `full`

---

## 4. API Management Architecture

### 4.1 Request & Response Lifecycle
1. **Request Interceptor**:
   - Inspects `authStore` for an active `accessToken`.
   - Injects `Authorization: Bearer <token>`.
   - Attaches `X-Client-Timestamp` for performance monitoring.
2. **Response Interceptor**:
   - Catches 401 Unauthorized responses and calls `authStore.logout()`.
   - Normalizes all errors (network offline, timeouts, HTTP 4xx/5xx) into typed `ApiError` instances.
   - Handles request cancellations cleanly without throwing fatal errors.

### 4.2 Query Key Factory Pattern
Cache keys are strictly typed and centralized in `api/queryKeys.ts`:
```typescript
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: Record<string, any>) => [...queryKeys.users.lists(), params] as const,
    detail: (id: string | number) => [...queryKeys.users.all, 'detail', String(id)] as const,
  },
};
```

---

## 5. Security & RBAC Routing

### 5.1 Route Guards
Routes specify access restrictions declaratively:
```tsx
<ProtectedRoute requiredRole={['admin', 'manager']} requiredPermission="users:write">
  <UsersPage />
</ProtectedRoute>
```

### 5.2 Granular Hook (`usePermissions`)
Components verify permissions without knowing the underlying user structure:
```tsx
const { can, isRole } = usePermissions();

if (can('settings:write')) {
  // Render privileged action
}
```

---

## 6. Performance Optimization Standards

1. **Route-Level Code Splitting**: All pages are loaded via `React.lazy()` inside `AppRoutes.tsx`.
2. **Vite Manual Chunks**: `vite.config.ts` divides bundles into `vendor` (React core), `query` (TanStack Query + Axios), and `ui` (Lucide icons).
3. **Debounced Search**: Text inputs use `useDebounce` to throttle backend queries and avoid network thrashing.
4. **Caching & Garbage Collection**: Queries have a 5-minute `staleTime` and 15-minute `gcTime`.
