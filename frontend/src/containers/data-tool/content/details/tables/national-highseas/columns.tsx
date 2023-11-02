import { format } from 'd3-format';

const columns = [
  {
    accessorKey: 'protectedArea',
    header: 'Protected Area',
    cell: ({ row }) => <span className="underline">{row.original.protectedArea}</span>,
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
    accessorKey: 'protectedAreaType',
    header: 'Protected Area Type',
  },
  {
    accessorKey: 'establishmentStage',
    header: 'Establishment Stage',
  },
  {
    accessorKey: 'protectionLevel',
    header: 'Protection Level',
  },
  {
    accessorKey: 'fishingProtectionLevel',
    header: 'Fishing Protection Level',
    cell: ({ row }) => {
      const { fishingProtectionLevel: value } = row.original;
      if (!value) return <>No data</>;
      return value;
    },
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
];

export default columns;
