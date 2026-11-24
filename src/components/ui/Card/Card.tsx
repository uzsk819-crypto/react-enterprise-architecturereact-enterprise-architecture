import React from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...rest }) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-theme shadow-theme p-6 transition-all duration-200',
        hoverable && 'hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4 border-b border-border', className)} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...rest
}) => (
  <h3 className={cn('text-lg font-bold tracking-tight text-text-primary', className)} {...rest}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...rest
}) => (
  <p className={cn('text-xs text-text-muted', className)} {...rest}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cn('pt-4', className)} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cn('flex items-center pt-4 border-t border-border mt-4', className)} {...rest}>
    {children}
  </div>
);
