import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Database } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Spinner } from '../Spinner';
import type { TableProps, Column } from './table.types';

export function Table<T extends object>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found',
  rowKey = 'id' as keyof T,
  onRowClick,
  sortBy,
  sortOrder = 'asc',
  onSort,
  selectable = false,
  selectedRowKeys = [],
  onSelectRows,
  dense = false,
  className,
}: TableProps<T>) {
  const getRowId = (row: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(row, index);
    const val = (row as Record<string, unknown>)[rowKey as string];
    return val !== undefined && val !== null ? String(val) : String(index);
  };

  const allRowKeys = data.map((row, idx) => getRowId(row, idx));
  const isAllSelected =
    data.length > 0 && allRowKeys.every((key) => selectedRowKeys.includes(key));
  const isPartiallySelected =
    selectedRowKeys.length > 0 && !isAllSelected && allRowKeys.some((k) => selectedRowKeys.includes(k));

  const handleSelectAll = () => {
    if (!onSelectRows) return;
    if (isAllSelected) {
      onSelectRows([]);
    } else {
      onSelectRows(allRowKeys);
    }
  };

  const handleSelectRow = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!onSelectRows) return;
    if (selectedRowKeys.includes(key)) {
      onSelectRows(selectedRowKeys.filter((k) => k !== key));
    } else {
      onSelectRows([...selectedRowKeys, key]);
    }
  };

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    if (sortBy !== col.key) {
      return <ArrowUpDown className="h-3 w-3 text-text-muted opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  const cellPaddingClass = dense ? 'px-3.5 py-1.5' : 'px-4 py-2.5';
  const headerPaddingClass = dense ? 'px-3.5 py-2' : 'px-4 py-2.5';

  return (
    <div className={cn('relative w-full overflow-hidden border border-border rounded-theme bg-surface shadow-xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-hover/70">
              {selectable && (
                <th className={cn('w-10 text-center', headerPaddingClass)}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      'font-semibold text-[11px] tracking-wider uppercase text-text-secondary select-none',
                      headerPaddingClass,
                      alignClass,
                      col.sortable && 'cursor-pointer hover:text-text-primary group'
                    )}
                    onClick={() => col.sortable && onSort?.(col.key)}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        col.align === 'right' && 'flex-row-reverse'
                      )}
                    >
                      <span>{col.header}</span>
                      {renderSortIcon(col)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/80">
            {isLoading && data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-10 text-center"
                >
                  <Spinner size="md" label="Loading data..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-10 text-center text-text-muted"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Database className="h-7 w-7 text-text-muted/60" />
                    <p className="text-xs font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = getRowId(row, index);
                const isSelected = selectedRowKeys.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'transition-colors duration-100',
                      onRowClick && 'cursor-pointer',
                      isSelected ? 'bg-primary-50/50 dark:bg-primary-900/20' : 'hover:bg-surface-hover/60'
                    )}
                  >
                    {selectable && (
                      <td className={cn('w-10 text-center', cellPaddingClass)} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(id, e as unknown as React.MouseEvent)}
                          aria-label={`Select row ${id}`}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                      return (
                        <td
                          key={`${id}-${col.key}`}
                          className={cn('text-text-primary text-xs', cellPaddingClass, alignClass)}
                        >
                          {col.render ? col.render(row, index) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating subtle loader for refetching */}
      {isLoading && data.length > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-surface/90 backdrop-blur-sm border border-border px-2.5 py-0.5 rounded-full text-[11px] shadow-xs">
          <Spinner size="xs" />
          <span className="text-text-muted font-medium">Updating...</span>
        </div>
      )}
    </div>
  );
}
