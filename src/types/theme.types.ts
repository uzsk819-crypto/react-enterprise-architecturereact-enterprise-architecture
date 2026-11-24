export type ThemeMode = 'light' | 'dark' | 'system';

export type BrandColor = 'indigo' | 'blue' | 'emerald' | 'violet' | 'rose';

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ThemeConfig {
  mode: ThemeMode;
  brand: BrandColor;
  radius: BorderRadius;
}

export interface ThemeContextValue extends ThemeConfig {
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: BrandColor) => void;
  setRadius: (radius: BorderRadius) => void;
  toggleMode: () => void;
}
