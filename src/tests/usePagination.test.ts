import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';

describe('usePagination hook', () => {
  it('calculates correct initial totalPages and navigation flags', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, initialPage: 1, initialPageSize: 10 })
    );

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.canPrevPage).toBe(false);
    expect(result.current.canNextPage).toBe(true);
  });

  it('advances page correctly with nextPage', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, initialPage: 1, initialPageSize: 10 })
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.canPrevPage).toBe(true);
    expect(result.current.canNextPage).toBe(true);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(3);
    expect(result.current.canNextPage).toBe(false);
  });

  it('resets page to 1 when setPageSize is called', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, initialPage: 2, initialPageSize: 10 })
    );

    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPageSize(20);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalPages).toBe(2);
  });
});
