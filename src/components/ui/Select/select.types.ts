import React from 'react';
import type { SelectOption } from '../../../types/common.types';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  fullWidth?: boolean;
}
