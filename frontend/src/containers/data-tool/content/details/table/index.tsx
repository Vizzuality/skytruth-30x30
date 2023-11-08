import { useLayoutEffect, useRef, useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/classnames';

// ! todo: type columns,data properly
const DataToolTable = ({ columns, data }) => {
  const tableRef = useRef<HTMLTableElement>();
  const firstColumnRef = useRef<HTMLTableCellElement>(null);

  const [tableDimensions, setTableDimensions] = useState<{
    firstColumnWidth: HTMLTableCellElement['offsetWidth'];
    tableWidth: HTMLTableElement['offsetWidth'];
    availableBarWidth: number;
  }>({
    firstColumnWidth: 0,
    tableWidth: 0,
    availableBarWidth: 0,
  });

  const table = useReactTable<typeof data>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const hasData = table.getRowModel().rows?.length;

  const firstColumn = columns[0];
  const lastColumn = columns[columns.length - 1];

  useLayoutEffect(() => {
    const tableWidth = tableRef.current?.offsetWidth;
    const firstColumnWidth = firstColumnRef.current?.offsetWidth;
    const availableBarWidth = tableWidth - firstColumnWidth;

    setTableDimensions({
      firstColumnWidth,
      tableWidth,
      availableBarWidth,
    });
  }, [data]);

  return (
    <table ref={tableRef} className="whitespace-nowrap font-mono text-xs">
      <thead className="text-left">
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
                    'h-10 py-3 pl-6 pr-16': true,
                    'border-r border-dashed border-black pl-0 pr-5': isFirstColumn,
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
            const coverage = row.original?.coverage || null; // %;
            const offset = tableDimensions.firstColumnWidth;
            const barWidth = (coverage * tableDimensions.availableBarWidth) / 100;

            return (
              <tr
                key={row.id}
                className="border-b border-t border-black"
                style={{
                  backgroundImage: `linear-gradient(to right, rgb(72, 121, 255) ${barWidth}px, transparent ${barWidth}px)`,
                  backgroundPositionX: `${offset}px`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const isFirstColumn = column.id === firstColumn.accessorKey;
                  const isLastColumn = column.id === lastColumn.accessorKey;

                  return (
                    <td
                      key={cell.id}
                      className={cn({
                        'h-16 py-3 pl-6 pr-16': true,
                        'border-r border-dashed border-black pl-0 pr-5': isFirstColumn,
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

export default DataToolTable;
