import { useRef } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/classnames';

// ! todo: type columns,data properly
const MapTable = ({ columns, data }) => {
  const tableRef = useRef<HTMLTableElement>();
  const firstColumnRef = useRef<HTMLTableCellElement>(null);

  const table = useReactTable<typeof data>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const hasData = table.getRowModel().rows?.length > 0;

  const firstColumn = columns[0];
  const lastColumn = columns[columns.length - 1];

  return (
    <table
      ref={tableRef}
      className="relative border-separate border-spacing-0 whitespace-nowrap pr-6 font-mono text-xs"
    >
      <thead className="sticky -top-4 z-10 bg-white text-left">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const { id, column } = header;
              const isFirstColumn = id === firstColumn.accessorKey;
              const isLastColumn = id === lastColumn.accessorKey;

              return (
                <th
                  key={id}
                  ref={isFirstColumn ? firstColumnRef : null}
                  className={cn({
                    'h-10 border-b border-black py-3 pl-6 pr-16': true,
                    'details-table-first-column-border border-black pl-0 pr-5': isFirstColumn,
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
          table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="border-b border-t border-black">
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const isFirstColumn = column.id === firstColumn.accessorKey;
                  const isLastColumn = column.id === lastColumn.accessorKey;

                  return (
                    <td
                      key={cell.id}
                      className={cn({
                        'h-16 border-b border-black py-3 pl-6 pr-16': true,
                        'details-table-first-column-border border-black pl-0 pr-5': isFirstColumn,
                        'pr-0': isLastColumn,
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
              No results.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MapTable;
