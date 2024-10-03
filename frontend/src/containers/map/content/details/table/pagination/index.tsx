import { PaginationState, RowData, Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { Button } from '@/components/ui/button';

export interface PaginationProps<TData> {
  table: Table<TData>;
  pagination: PaginationState;
  rowCount: number;
}

const Pagination = <TData extends RowData>({
  table,
  pagination,
  rowCount,
}: PaginationProps<TData>) => {
  const t = useTranslations('containers.map');

  return (
    <div className="sticky bottom-0 left-0 flex items-center justify-end p-3">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs">
        {t('results-out-of', {
          startIndex: pagination.pageIndex * pagination.pageSize + 1,
          endIndex: Math.min(pagination.pageSize * (1 + pagination.pageIndex), rowCount),
          total: rowCount,
        })}
      </div>
      <div className="flex gap-x-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{t('previous-page')}</span>
          <LuChevronLeft className="h-4 w-4" />
        </Button>
        {pagination.pageIndex + 1 > 2 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
            onClick={() => table.setPageIndex(0)}
          >
            {t.rich('page-number', {
              number: 1,
              a: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </Button>
        )}
        {pagination.pageIndex > 2 && '…'}
        {table.getCanPreviousPage() && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t.rich('page-number', {
              number: pagination.pageIndex,
              a: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 border border-black bg-orange font-mono text-xs hover:border hover:border-black hover:bg-orange focus-visible:border focus-visible:border-black"
          aria-pressed
        >
          {t.rich('page-number', {
            number: pagination.pageIndex + 1,
            a: (chunks) => <span className="sr-only">{chunks}</span>,
          })}
        </Button>
        {table.getCanNextPage() && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t.rich('page-number', {
              number: pagination.pageIndex + 2,
              a: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </Button>
        )}
        {table.getPageCount() - (pagination.pageIndex + 1) > 2 && '…'}
        {table.getPageCount() - (pagination.pageIndex + 1) > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            {t.rich('page-number', {
              number: table.getPageCount(),
              a: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-7 w-7 font-mono text-xs hover:border hover:border-black focus-visible:border focus-visible:border-black"
        >
          <span className="sr-only">{t('next-page')}</span>
          <LuChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
