import { useMemo } from 'react';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';

import { PAGES } from '@/constants/pages';
import FiltersButton from '@/containers/data-tool/content/details/table/filters-button';
import HeaderItem from '@/containers/data-tool/content/details/table/header-item';
import { cellFormatter } from '@/containers/data-tool/content/details/table/helpers';
import SortingButton from '@/containers/data-tool/content/details/table/sorting-button';
import TooltipButton from '@/containers/data-tool/content/details/table/tooltip-button';
import useFiltersOptions from '@/containers/data-tool/content/details/tables/global-regional/useFiltersOptions';
import useTooltips from '@/containers/data-tool/content/details/tables/global-regional/useTooltips';
import { useDataToolSearchParams } from '@/containers/data-tool/content/map/sync-settings';

export type GlobalRegionalTableColumns = {
  location: string;
  locationCode: string;
  coverage: number;
  locationType: string;
  mpas: number;
  oecms: number;
  area: number;
  fullyHighProtected: number;
  highlyProtectedLFP: number;
  globalContribution: number;
};

type UseColumnsProps = {
  filters: { [key: string]: string[] };
  onFiltersChange: (field: string, values: string[]) => void;
};

const useColumns = ({ filters, onFiltersChange }: UseColumnsProps) => {
  const searchParams = useDataToolSearchParams();
  const { locationTypes: locationTypesOptions } = useFiltersOptions();

  const tooltips = useTooltips();

  const columns: ColumnDef<GlobalRegionalTableColumns>[] = useMemo(() => {
    return [
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          const { location, locationCode } = row.original;
          return (
            <Link
              className="underline"
              href={`${PAGES.dataTool}/${locationCode}?${searchParams.toString()}`}
            >
              {location}
            </Link>
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
          if (!value) return <>&mdash;</>;

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
        accessorKey: 'locationType',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={locationTypesOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Location type
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { locationType: value } = row.original;
          const formattedValue = cellFormatter.capitalize(value);
          return <>{formattedValue}</>;
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
      },
      {
        accessorKey: 'area',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Area
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
        accessorKey: 'fullyHighProtected',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Fully/Highly Protected
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { fullyHighProtected: value } = row.original;
          if (!value) return <>No data</>;
          const formattedValue = cellFormatter.percentage(value);
          return <span className="text-xs">{formattedValue}%</span>;
        },
      },
      {
        accessorKey: 'highlyProtectedLFP',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            Highly Protected LFP
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { highlyProtectedLFP: value } = row.original;
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
    // ! If we add dependencies, the columns will re-render and the popovers will close on updates / act funny
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return columns;
};

export default useColumns;
