import { format } from 'd3-format';

// ! type me
const columns = [
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
    header: 'Coverage',
    cell: ({ row }) => {
      const { coverage: value } = row.original;
      if (!value) return <>&mdash;</>;
      return (
        <span className="text-4xl font-bold">
          {value}
          <span className="text-xs">%</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'locationType',
    header: 'Location type',
  },
  {
    accessorKey: 'mpas',
    header: 'MPAs',
  },
  {
    accessorKey: 'oecms',
    header: 'OECMs',
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => {
      const { area: value } = row.original;
      const formattedValue = format(',.2r')(value);
      return (
        <span>
          {formattedValue} km<sup>2</sup>
        </span>
      );
    },
  },
  {
    accessorKey: 'fullyHighProtected',
    header: 'Fully/Highly Protected',
    cell: ({ row }) => {
      const { fullyHighProtected: value } = row.original;
      if (!value) return <>No data</>;
      return (
        <>
          {value}
          <span className="text-xs">%</span>
        </>
      );
    },
  },
  {
    accessorKey: 'highlyProtectedLFP',
    header: 'Highly Protected LFP',
    cell: ({ row }) => {
      const { highlyProtectedLFP: value } = row.original;
      if (!value) return <>No data</>;
      return (
        <>
          {value}
          <span className="text-xs">%</span>
        </>
      );
    },
  },
  {
    accessorKey: 'globalContribution',
    header: 'Global contribution',
    cell: ({ row }) => {
      const { globalContribution: value } = row.original;
      if (!value) return <>No data</>;
      return (
        <>
          {value}
          <span className="text-xs">%</span>
        </>
      );
    },
  },
];

export default columns;
