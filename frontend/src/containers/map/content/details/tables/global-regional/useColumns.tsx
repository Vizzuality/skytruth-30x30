import { useMemo } from 'react';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';

import { PAGES } from '@/constants/pages';
import HeaderItem from '@/containers/map/content/details/table/header-item';
import { cellFormatter } from '@/containers/map/content/details/table/helpers';
import SortingButton from '@/containers/map/content/details/table/sorting-button';
import TooltipButton from '@/containers/map/content/details/table/tooltip-button';
import useTooltips from '@/containers/map/content/details/tables/global-regional/useTooltips';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';

export type GlobalRegionalTableColumns = {
  location: string;
  locationCode: string;
  coverage: number;
  locationType: string;
  mpas: number;
  oecms: number;
  area: number;
  fullyHighlyProtected: number;
  highlyProtectedLfp: number;
  globalContribution: number;
};

const useColumns = () => {
  const searchParams = useMapSearchParams();
  const tooltips = useTooltips();

  const columns: ColumnDef<GlobalRegionalTableColumns>[] = useMemo(() => {
    return [
      {
        accessorKey: 'location',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Name
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { location, locationCode } = row.original;
          return (
            <HeaderItem>
              <Link
                className="underline"
                href={`${PAGES.progressTracker}/${locationCode}?${searchParams.toString()}`}
              >
                {location}
              </Link>
            </HeaderItem>
          );
        },
      },
      {
        accessorKey: 'coverage',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Coverage
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { coverage: value } = row.original;
          const formattedCoverage = cellFormatter.percentage(value);

          return (
            <span className="text-4xl font-bold">
              {formattedCoverage}
              <span className="text-xs">%</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'area',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Area
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { area: value } = row.original;
          const formattedValue = cellFormatter.area(value);
          return (
            <span>
              {formattedValue} km<sup>2</sup>
            </span>
          );
        },
      },
      {
        accessorKey: 'mpas',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            MPAs
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { mpas: value } = row.original;
          if (Number.isNaN(value)) return 'N/A';

          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
      {
        accessorKey: 'oecms',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            OECMs
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { oecms: value } = row.original;
          if (Number.isNaN(value)) return 'N/A';

          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
      {
        accessorKey: 'fullyHighlyProtected',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Fully/Highly Protected
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { fullyHighlyProtected: value } = row.original;
          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
      {
        accessorKey: 'highlyProtectedLfp',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Highly Protected LFP
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { highlyProtectedLfp: value } = row.original;
          if (!value) return <>No data</>;
          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
      {
        accessorKey: 'globalContribution',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Global contribution
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { globalContribution: value } = row.original;
          if (!value) return <>No data</>;
          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
    ];
  }, [searchParams, tooltips]);

  return columns;
};

export default useColumns;
