# Enterprise React + TypeScript Frontend Architecture

A clean, production-ready, highly reusable React + TypeScript frontend foundation built for modern enterprise web applications.

---

## 🏛️ Architectural Highlights

- **Simple & Scalable Component-Based Architecture**: Eliminates unnecessary feature-folder bloat and complex business layers.
- **Centralized & Modular**:
  - **Components**: Independently organized UI components (`Button`, `Input`, `Select`, `Modal`, `Table`, `Card`, `Badge`, `Spinner`).
  - **Hooks**: Centralized, standalone custom hooks (`useDebounce`, `usePagination`, `useLocalStorage`, `useClickOutside`, `useMediaQuery`, `useTheme`, `useAuth`, `usePermissions`).
  - **API Management**: Central Axios instance with request/response interceptors, centralized `ApiError` mapping, typed API services, request cancellation (`AbortSignal`), and TanStack Query caching.
  - **Routing**: Centralized React Router configuration with layout nesting, lazy code-splitting, role-based guards, and 403/404 fallbacks.
  - **Theme System**: Dynamic CSS variable tokens coupled with Tailwind CSS (`data-theme="dark"`, `data-brand="indigo|blue|emerald|violet|rose"`, and `data-radius="none|sm|md|lg|full"`).
- **Multi-Project Reusability**: All foundational UI components, hooks, services, and theme primitives can be transplanted into any new application without modification.

---

## 📦 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI Library |
| **TypeScript (Strict)** | Static typing, 100% strictness, zero `any` |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Dynamic CSS variable-driven utility classes |
| **React Router v6** | Client-side routing, protected routes & layouts |
| **TanStack Query v5** | Server state management, auto-caching, mutation invalidation |
| **Axios** | HTTP client with interceptors & cancellation support |
| **Zustand** | Lightweight client state (Theme & Auth sessions) |
| **React Hook Form + Zod**| Robust, type-safe form validation |
| **Lucide React** | Modern, accessible SVG icons |
| **Vitest + RTL** | Fast unit and integration testing |

---

## 📂 Project Directory Structure

```text
src/
├── api/                   # Centralized API layer
│   ├── client.ts          # Central Axios instance + interceptors + cancellation
│   ├── apiError.ts        # Standardized ApiError class
│   ├── endpoints.ts       # Central API endpoint registry
│   ├── queryClient.ts     # TanStack QueryClient with defaults
│   ├── queryKeys.ts       # Query key factories for cache invalidation
│   ├── services/          # Typed API service functions
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   └── index.ts
├── components/
│   ├── common/            # Shared structural components (ErrorBoundary, LoadingFallback)
│   ├── layouts/           # AppLayout, AuthLayout
│   └── ui/                # Independent, reusable UI components
│       ├── Badge/         # Badge.tsx, index.ts
│       ├── Button/        # Button.tsx, button.types.ts, button.styles.ts, index.ts
│       ├── Card/          # Card.tsx, index.ts
│       ├── Input/         # Input.tsx, input.types.ts, index.ts
│       ├── Modal/         # Modal.tsx, modal.types.ts, index.ts
│       ├── Select/        # Select.tsx, select.types.ts, index.ts
│       ├── Spinner/       # Spinner.tsx, index.ts
│       ├── Table/         # Table.tsx, table.types.ts, index.ts
│       └── index.ts       # Central barrel export
├── config/                # Environment configuration
│   └── env.config.ts
├── hooks/                 # Centralized, reusable custom hooks
│   ├── useAuth.ts         # Authentication session hook
│   ├── useClickOutside.ts # Dropdown/modal click outside detection
│   ├── useDebounce.ts     # Fast-changing value debounce
│   ├── useLocalStorage.ts # Synchronized local storage
│   ├── useMediaQuery.ts   # Responsive CSS media query hook
│   ├── usePagination.ts   # Reusable pagination state & controls
│   ├── usePermissions.ts  # Role and granular permission check hook
│   ├── useTheme.ts        # Dynamic theme & brand switcher hook
│   └── index.ts
├── pages/                 # Clean, focused page components
│   ├── auth/              # LoginPage.tsx
│   ├── dashboard/         # DashboardPage.tsx
│   ├── users/             # UsersPage.tsx (Table + Search + Pagination + TanStack Query)
│   ├── settings/          # SettingsPage.tsx (Theme, Brand & Token Switcher)
│   └── error/             # NotFoundPage.tsx, UnauthorizedPage.tsx
├── routes/                # Centralized routing & guards
│   ├── AppRoutes.tsx      # Main application router with Suspense
│   ├── ProtectedRoute.tsx # Route guard with RBAC & permissions
│   └── routePaths.ts      # Route path constants
├── store/                 # Global Zustand stores
│   ├── authStore.ts       # User session and auth state
│   └── themeStore.ts      # Theme mode, brand palette, and radius state
├── styles/                # Global styles and CSS variable definitions
│   ├── index.css          # Tailwind imports & root scrollbar styling
│   └── theme.css          # CSS Variables for light, dark, and brand palettes
├── tests/                 # Unit tests & test setup
│   ├── setup.ts
│   ├── Button.test.tsx
│   ├── useDebounce.test.ts
│   └── usePagination.test.ts
├── types/                 # Centralized TypeScript definitions
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── common.types.ts
│   └── theme.types.ts
├── utils/                 # Utilities
│   └── cn.ts              # clsx + twMerge utility
├── App.tsx                # App root with providers
└── main.tsx               # Entry point
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create `.env` based on `.env.example`:

```bash
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_API_TIMEOUT=15000
VITE_APP_NAME="Enterprise Frontend Architecture"
```

### 3. Development Server

```bash
npm run dev
```

### 4. Running Unit Tests

```bash
npm run test
```

### 5. Production Build

```bash
npm run build
```

---

## 🎨 Dynamic Theme System

Theme customization is powered by CSS variables mapped into Tailwind CSS:

- **Theme Modes**: `light`, `dark`, and `system` (matches OS preference automatically).
- **Brand Colors**: `indigo` (default), `blue`, `emerald`, `violet`, `rose`.
- **Border Radius**: `none`, `sm` (4px), `md` (8px), `lg` (12px), `full` (pill).

To change themes globally in any component or page:

```tsx
import { useTheme } from '@/hooks';

function ThemeControls() {
  const { mode, setMode, brand, setBrand, radius, setRadius } = useTheme();

  return (
    <button onClick={() => setBrand('emerald')}>
      Switch to Emerald Brand
    </button>
  );
}
```

---

## 🛡️ Protected Routes & Permissions

Wrap routes with `<ProtectedRoute>` to enforce authentication, roles, or granular permissions:

```tsx
<Route
  path="/admin/users"
  element={
    <ProtectedRoute requiredRole="admin" requiredPermission="users:write">
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

Inside components:

```tsx
import { usePermissions } from '@/hooks';

function DeleteUserButton() {
  const { can, isRole } = usePermissions();

  if (!can('users:delete')) return null;

  return <Button variant="danger">Delete</Button>;
}
```

---

## 🌐 Centralized API Management

### Central Axios Instance (`api/client.ts`)
- Automatically attaches bearer tokens.
- Handles standardized error mapping to `ApiError`.
- Handles session expiry and cancellation.

### Centralized Service (`api/services/user.service.ts`)
```tsx
import { useQuery } from '@tanstack/react-query';
import { userService, queryKeys } from '@/api';

export function useUsersList(page: number, limit: number, search?: string) {
  return useQuery({
    queryKey: queryKeys.users.list({ page, limit, search }),
    queryFn: ({ signal }) => userService.getUsers({ page, limit, search }, signal),
  });
}
```

---

## 🔄 How to Reuse in a New Project

To spin up a new enterprise project using this foundation:
1. Copy the `src/components/ui/`, `src/hooks/`, `src/api/` (client & setup), `src/styles/`, and `src/types/` folders.
2. In `src/config/env.config.ts`, set the new project's backend URL.
3. In `src/styles/theme.css`, customize your corporate brand colors.
4. Define your project's endpoints in `src/api/endpoints.ts` and services in `src/api/services/`.
5. Add your pages in `src/pages/` and wire routes in `src/routes/AppRoutes.tsx`.

No refactoring of components or hooks is ever required!
