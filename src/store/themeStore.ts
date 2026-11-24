import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, BrandColor, BorderRadius, ThemeConfig } from '../types/theme.types';

interface ThemeState extends ThemeConfig {
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: BrandColor) => void;
  setRadius: (radius: BorderRadius) => void;
  toggleMode: () => void;
  initTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (resolved: 'light' | 'dark', brand: BrandColor, radius: BorderRadius) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Set theme mode (light / dark)
  root.setAttribute('data-theme', resolved);
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set brand palette & radius variables
  root.setAttribute('data-brand', brand);
  root.setAttribute('data-radius', radius);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      brand: 'indigo',
      radius: 'md',
      resolvedMode: 'light',

      setMode: (mode: ThemeMode) => {
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        set({ mode, resolvedMode: resolved });
        applyThemeToDOM(resolved, get().brand, get().radius);
      },

      setBrand: (brand: BrandColor) => {
        set({ brand });
        applyThemeToDOM(get().resolvedMode, brand, get().radius);
      },

      setRadius: (radius: BorderRadius) => {
        set({ radius });
        applyThemeToDOM(get().resolvedMode, get().brand, radius);
      },

      toggleMode: () => {
        const current = get().resolvedMode;
        const next = current === 'dark' ? 'light' : 'dark';
        get().setMode(next);
      },

      initTheme: () => {
        const mode = get().mode;
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        set({ resolvedMode: resolved });
        applyThemeToDOM(resolved, get().brand, get().radius);

        // Listen for system theme changes if set to system
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const listener = (e: MediaQueryListEvent) => {
            if (get().mode === 'system') {
              const newResolved = e.matches ? 'dark' : 'light';
              set({ resolvedMode: newResolved });
              applyThemeToDOM(newResolved, get().brand, get().radius);
            }
          };
          mediaQuery.addEventListener('change', listener);
        }
      },
    }),
    {
      name: 'app-theme-storage',
      partialize: (state) => ({
        mode: state.mode,
        brand: state.brand,
        radius: state.radius,
      }),
    }
  )
);
