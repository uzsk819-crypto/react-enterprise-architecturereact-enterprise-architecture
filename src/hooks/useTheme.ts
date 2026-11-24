import { useThemeStore } from '../store/themeStore';

/**
 * Centralized theme hook providing access to theme state and theme manipulation utilities.
 */
export function useTheme() {
  const {
    mode,
    brand,
    radius,
    resolvedMode,
    setMode,
    setBrand,
    setRadius,
    toggleMode,
    initTheme,
  } = useThemeStore();

  return {
    mode,
    brand,
    radius,
    resolvedMode,
    isDark: resolvedMode === 'dark',
    setMode,
    setBrand,
    setRadius,
    toggleMode,
    initTheme,
  };
}
