import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label,
  className,
  ...rest
}) => {
  return (
    <div
      role="status"
      aria-label={label || 'Loading...'}
      className={cn('inline-flex items-center justify-center gap-2 text-primary', className)}
      {...rest}
    >
      <Loader2 className={cn('animate-spin', sizeMap[size])} />
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};
