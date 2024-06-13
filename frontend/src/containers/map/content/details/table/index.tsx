import { useRef } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
  });

  const hasData = table.getRowModel().rows?.length > 0;

  const firstColumn = columns[0];
  const secondColumn = columns[1];
  const lastColumn = columns[columns.length - 1];

  return (
    <table
      ref={tableRef}
      className="relative border-spacing-0 whitespace-nowrap pr-6 font-mono text-xs"
    >
      <thead className="sticky -top-4 z-10 bg-white text-left">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="shadow-[0_2px_0_-1px_rgb(0,0,0)]">
            {headerGroup.headers.map((header) => {
              const { id, column, index } = header;
              const isFirstColumn = id === firstColumn.accessorKey;
              const isSecondColumn = index === 1;
              const isLastColumn = id === lastColumn.accessorKey;

              return (
                <th
                  key={id}
                  ref={isFirstColumn ? firstColumnRef : null}
                  className={cn({
                    'h-10 py-3 pl-6 pr-16': true,
                    'pl-0 pr-5': isFirstColumn,
                    'border-l border-dashed border-black': isSecondColumn,
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
                  const isSecondColumn = column.id === secondColumn.accessorKey;
                  const isLastColumn = column.id === lastColumn.accessorKey;

                  return (
                    <td
                      key={cell.id}
                      className={cn({
                        'h-16 py-3 pl-6 pr-16': true,
                        'pl-0 pr-5': isFirstColumn,
                        'border-l border-dashed border-black': isSecondColumn,
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
