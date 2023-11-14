import { useMemo } from 'react';

import { ColumnDef } from '@tanstack/react-table';

import FiltersButton from '@/containers/data-tool/content/details/table/filters-button';
import HeaderItem from '@/containers/data-tool/content/details/table/header-item';
import { cellFormatter } from '@/containers/data-tool/content/details/table/helpers';
import SortingButton from '@/containers/data-tool/content/details/table/sorting-button';
import useFiltersOptions from '@/containers/data-tool/content/details/tables/national-highseas/useFiltersOptions';

export type NationalHighseasTableColumns = {
  protectedArea: string;
  coverage: number;
  protectedAreaType: string;
  establishmentStage: string;
  protectionLevel: string;
  fishingProtectionLevel: string;
  area: number;
};

type UseColumnsProps = {
  filters: { [key: string]: string[] };
  onFiltersChange: (field: string, values: string[]) => void;
};

const useColumns = ({ filters, onFiltersChange }: UseColumnsProps) => {
  const {
    protectionStatus: protectionStatusOptions,
    establishmentStage: establishmentStageOptions,
    protectionLevel: protectionLevelOptions,
    fishingProtectionLevel: fishingProtectionLevelOptions,
  } = useFiltersOptions();

  // Define columns
  const columns: ColumnDef<NationalHighseasTableColumns>[] = useMemo(() => {
    return [
      {
        accessorKey: 'protectedArea',
        header: 'Protected Area',
        cell: ({ row }) => {
          const { protectedArea } = row.original;
          return <span className="underline">{protectedArea}</span>;
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
        accessorKey: 'protectedAreaType',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={protectionStatusOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Protected Area Type
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { protectedAreaType: value } = row.original;
          const formattedValue = protectionStatusOptions.find(
            (entry) => value === entry?.value
          )?.name;
          return <>{formattedValue}</>;
        },
      },
      {
        accessorKey: 'establishmentStage',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={establishmentStageOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Establishment Stage
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { establishmentStage: value } = row.original;
          const formattedValue = establishmentStageOptions.find(
            (entry) => value === entry?.value
          )?.name;
          return <>{formattedValue}</>;
        },
      },
      {
        accessorKey: 'protectionLevel',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={protectionLevelOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Protection Level
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { protectionLevel: value } = row.original;
          const formattedValue = protectionLevelOptions.find(
            (entry) => value === entry?.value
          )?.name;
          return <>{formattedValue}</>;
        },
      },
      {
        accessorKey: 'fishingProtectionLevel',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={fishingProtectionLevelOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Fishing Protection Level
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { fishingProtectionLevel: value } = row.original;
          const formattedValue = fishingProtectionLevelOptions.find(
            (entry) => value === entry?.value
          )?.name;
          return <>{formattedValue}</>;
        },
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
    ];
    // ! If we add the filters dependency, the columns will re-render and the popovers will close on updates / act funny
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    protectionStatusOptions,
    establishmentStageOptions,
    protectionLevelOptions,
    fishingProtectionLevelOptions,
  ]);

  return columns;
};

export default useColumns;
