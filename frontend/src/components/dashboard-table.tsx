import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowDownAZ, ArrowDownUp, ArrowDownZA, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface DashboardTableItem {
  location: string;
  locationId: string;
  type: 'country' | 'region';
  signedInitiative: boolean;
  score: number | undefined;
  ecosystems: string[];
  updated: Date;
}

export interface DashboardTableProps {
  data: DashboardTableItem[];
}

const columns: ColumnDef<DashboardTableItem>[] = [
  {
    accessorKey: 'type',
    header: 'Location',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1.5">
        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {row.original.type['0'].toUpperCase()}
        </div>
        <Link
          href={`/dashboard/${row.original.locationId}`}
          className="underline ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {row.original.location}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'signedInitiative',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          Signed 30x30
          {!isSorted && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(false)}>
              <span className="sr-only">Sort ascending</span>
              <ArrowDownUp className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'asc' && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(true)}>
              <span className="sr-only">Sort descending</span>
              <ArrowDownAZ className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'desc' && (
            <Button size="icon" variant="ghost" onClick={() => column.clearSorting()}>
              <span className="sr-only">Clear sorting</span>
              <ArrowDownZA className="h-5 w-5" aria-hidden />
            </Button>
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const signed = row.original.signedInitiative;
      return (
        <div className="flex items-center gap-x-1.5">
          <div
            className={cn('h-4 w-4 rounded-full', {
              'bg-black': !signed,
              'bg-gray-400': signed,
            })}
          />
          {signed ? 'Yes' : 'No'}
        </div>
      );
    },
  },
  {
    accessorKey: 'score',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          Protection Score
          {!isSorted && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(false)}>
              <span className="sr-only">Sort ascending</span>
              <ArrowDownUp className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'asc' && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(true)}>
              <span className="sr-only">Sort descending</span>
              <ArrowDownAZ className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'desc' && (
            <Button size="icon" variant="ghost" onClick={() => column.clearSorting()}>
              <span className="sr-only">Clear sorting</span>
              <ArrowDownZA className="h-5 w-5" aria-hidden />
            </Button>
          )}
        </div>
      );
    },
    cell: ({ row }) => (row.original.score !== undefined ? `${row.original.score}% / 30%` : '−'),
  },
  {
    accessorKey: 'ecosystems',
    header: 'Ecosystems',
    cell: ({ row }) =>
      row.original.ecosystems.length < 2 ? (
        row.original.ecosystems
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="whitespace-nowrap">{`${row.original.ecosystems[0]} +${
              row.original.ecosystems.length - 1
            }`}</TooltipTrigger>
            <TooltipContent>
              <ul>
                {row.original.ecosystems.map((ecosystem) => (
                  <li key={ecosystem}>{ecosystem}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
  },
  {
    accessorKey: 'updated',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2 whitespace-nowrap">
          Last Updated
          {!isSorted && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(false)}>
              <span className="sr-only">Sort ascending</span>
              <ArrowDownUp className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'asc' && (
            <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(true)}>
              <span className="sr-only">Sort descending</span>
              <ArrowDownAZ className="h-5 w-5" aria-hidden />
            </Button>
          )}
          {isSorted === 'desc' && (
            <Button size="icon" variant="ghost" onClick={() => column.clearSorting()}>
              <span className="sr-only">Clear sorting</span>
              <ArrowDownZA className="h-5 w-5" aria-hidden />
            </Button>
          )}
        </div>
      );
    },
    cell: ({ row }) => format(row.original.updated, 'MMMM yyyy'),
  },
  {
    header: 'Map View',
    cell: () => (
      <Link
        href="/map"
        className="whitespace-nowrap underline ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <MapPin className="mr-1.5 inline-block h-4 w-4" aria-hidden />
        Show on Map
      </Link>
    ),
  },
];

const DashboardTable: React.FC<DashboardTableProps> = ({ data }) => (
  <DataTable columns={columns} data={data} />
);

export default DashboardTable;
