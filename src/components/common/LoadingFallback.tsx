import React from 'react';
import { Spinner } from '../ui/Spinner';

export const LoadingFallback: React.FC<{ message?: string }> = ({
  message = 'Loading application resources...',
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 gap-4">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-text-muted animate-pulse">{message}</p>
    </div>
  );
};
