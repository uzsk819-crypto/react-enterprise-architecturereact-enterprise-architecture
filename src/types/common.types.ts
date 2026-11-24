export type Nullable<T> = T | null;

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: SortOrder;
  search?: string;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
