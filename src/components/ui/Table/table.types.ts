import React from 'react';
import type { SortOrder } from '../../../types/common.types';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowKey?: keyof T | ((row: T, index: number) => string);
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortOrder?: SortOrder;
  onSort?: (columnKey: string) => void;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectRows?: (keys: string[]) => void;
  dense?: boolean;
  className?: string;
}
