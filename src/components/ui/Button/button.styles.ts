import type { ButtonVariant, ButtonSize } from './button.types';

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm disabled:bg-primary/50 disabled:cursor-not-allowed',
  secondary:
    'bg-surface-hover text-text-primary hover:bg-border active:scale-[0.98] border border-border disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'bg-transparent border border-primary text-primary hover:bg-primary/10 active:scale-[0.98] disabled:border-primary/40 disabled:text-primary/40 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-text-primary hover:bg-surface-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
  danger:
    'bg-danger text-white hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-theme gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-theme gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-theme gap-2.5',
};
