import { useMemo, useState, useCallback } from 'react';
import type { PaginationMetadata } from '../types/common.types';

export interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  meta: PaginationMetadata;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

/**
 * Centralized, reusable hook for pagination state and controls.
 */
export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPageState] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Ensure current page does not exceed totalPages
  const validPage = Math.min(Math.max(1, page), totalPages);

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(Math.min(Math.max(1, newPage), totalPages));
    },
    [totalPages]
  );

  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPageState(1); // reset to page 1 on page size change
  }, []);

  const canPrevPage = validPage > 1;
  const canNextPage = validPage < totalPages;

  const nextPage = useCallback(() => {
    if (canNextPage) setPageState((p) => p + 1);
  }, [canNextPage]);

  const prevPage = useCallback(() => {
    if (canPrevPage) setPageState((p) => p - 1);
  }, [canPrevPage]);

  const firstPage = useCallback(() => setPageState(1), []);
  const lastPage = useCallback(() => setPageState(totalPages), [totalPages]);

  const meta: PaginationMetadata = useMemo(
    () => ({
      currentPage: validPage,
      pageSize,
      totalPages,
      totalItems,
      hasNextPage: canNextPage,
      hasPrevPage: canPrevPage,
    }),
    [validPage, pageSize, totalPages, totalItems, canNextPage, canPrevPage]
  );

  return {
    page: validPage,
    pageSize,
    totalPages,
    meta,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canNextPage,
    canPrevPage,
  };
}
