import type { PaginationMetadata } from './common.types';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetadata;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: ApiErrorDetail[];
  timestamp?: string;
  path?: string;
}
