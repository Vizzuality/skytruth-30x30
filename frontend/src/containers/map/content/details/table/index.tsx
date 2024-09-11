import { useCallback, useRef } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

// ! todo: type columns,data properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MapTable: FCWithMessages = ({ columns, data, columnSeparators = null }) => {
  const locale = useLocale();
  const t = useTranslations('containers.map');

  const tableRef = useRef<HTMLTableElement>();
  const firstColumnRef = useRef<HTMLTableCellElement>(null);

  const table = useReactTable<typeof data>({
    data,
    columns,
    initialState: {
      sorting: [
        {
          id: columns?.[0]?.accessorKey,
          desc: false,
        },
      ],
    },
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    sortingFns: {
      localeStringCompare: (rowA, rowB, columnId) =>
        (rowA.original[columnId] as string).localeCompare(
          rowB.original[columnId as string],
          locale
        ),
    },
  });

  const hasData = table.getRowModel().rows?.length > 0;

  const firstColumn = columns[0];
  const lastColumn = columns[columns.length - 1];

  const shouldAddColumnSeparator = useCallback(
    (columnId) => {
      const isFirstColumn = columnId === firstColumn.accessorKey;
      return columnSeparators ? columnSeparators?.includes(columnId) : isFirstColumn;
    },
    [columnSeparators, firstColumn.accessorKey]
  );

  return (
    <table
      ref={tableRef}
      className="relative min-w-full border-spacing-0 whitespace-nowrap pr-6 font-mono text-xs"
    >
      <thead className="sticky -top-4 z-10 bg-white text-left">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="shadow-[0_2px_0_-1px_rgb(0,0,0)]">
            {headerGroup.headers.map((header) => {
              const { id, column } = header;
              const isFirstColumn = id === firstColumn.accessorKey;
              const isLastColumn = id === lastColumn.accessorKey;
              const isMapColumn = column.id === 'map';

              return (
                <th
                  key={id}
                  ref={isFirstColumn ? firstColumnRef : null}
                  className={cn({
                    'border-r border-dashed border-black': shouldAddColumnSeparator(id),
                    'h-10': true,
                    'pl-6 pr-16': !isMapColumn,
                    'pl-0 pr-5': isFirstColumn,
                    'pr-0': isLastColumn,
                  })}
                >
                  {flexRender(column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {hasData &&
          table.getRowModel().rows.map((row, idx) => {
            const { depth } = row;
            const isParentRow = depth === 0;
            const isFirstRow = idx === 0;
            const isLastRow = idx + 1 === table.getRowModel().rows.length;

            return (
              <tr
                key={row.id}
                className={cn({
                  'border-t border-black': !isFirstRow,
                  'border-dashed': !isParentRow,
                  'border-b': isLastRow,
                })}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const isFirstColumn = column.id === firstColumn.accessorKey;
                  const isLastColumn = column.id === lastColumn.accessorKey;
                  const isMapColumn = column.id === 'map';

                  return (
                    <td
                      key={cell.id}
                      className={cn({
                        'h-16 pl-6': true,
                        'pl-6 pr-16 ': !isMapColumn,
                        '-mt-px -mb-px': isMapColumn,
                        'pl-0 pr-5': isFirstColumn,
                        'pr-0': isLastColumn,
                        'border-r border-dashed border-black': shouldAddColumnSeparator(column.id),
                      })}
                    >
                      {flexRender(column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}

        {!hasData && (
          <tr>
            <td colSpan={columns.length} className="h-24 text-center">
              {t('no-results')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

MapTable.messages = ['containers.map'];

export default MapTable;
