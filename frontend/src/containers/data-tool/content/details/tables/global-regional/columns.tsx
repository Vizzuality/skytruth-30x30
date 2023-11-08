import { ColumnDef } from '@tanstack/react-table';

import HeaderItem from '@/containers/data-tool/content/details/table/header-item';
import { cellFormatter } from '@/containers/data-tool/content/details/table/helpers';
import SortingButton from '@/containers/data-tool/content/details/table/sorting-button';

export type GlobalRegionalTableColumns = {
  location: string;
  coverage: number;
  locationType: string;
  mpas: number;
  oecms: number;
  area: number;
  fullyHighProtected: number;
  highlyProtectedLFP: number;
  globalContribution: number;
};

const columns: ColumnDef<GlobalRegionalTableColumns>[] = [
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const { location } = row.original;
      return <span className="underline">{location}</span>;
    },
  },
  {
    accessorKey: 'coverage',
    header: ({ column }) => (
      <HeaderItem>
        <SortingButton column={column} />
        Coverage
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
    header: 'Location type',
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
      </HeaderItem>
    ),
  },
  {
    accessorKey: 'oecms',
    header: ({ column }) => (
      <HeaderItem>
        <SortingButton column={column} />
        OECMs
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

export default columns;
