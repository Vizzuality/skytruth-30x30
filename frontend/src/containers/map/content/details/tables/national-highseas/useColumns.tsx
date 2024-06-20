import { useMemo } from 'react';

import { ColumnDef } from '@tanstack/react-table';

import FiltersButton from '@/components/filters-button';
import LayerPreview from '@/components/layer-preview';
import ExpansionControls from '@/containers/map/content/details/table/expansion-controls';
import HeaderItem from '@/containers/map/content/details/table/header-item';
import { cellFormatter } from '@/containers/map/content/details/table/helpers';
import SortingButton from '@/containers/map/content/details/table/sorting-button';
import TooltipButton from '@/containers/map/content/details/table/tooltip-button';
import useFiltersOptions from '@/containers/map/content/details/tables/national-highseas/useFiltersOptions';
import useTooltips from '@/containers/map/content/details/tables/national-highseas/useTooltips';

export type NationalHighseasTableColumns = {
  protectedArea: string;
  coverage: number;
  protectedAreaType: string;
  establishmentStage: string;
  protectionLevel: string;
  fishingProtectionLevel: string;
  area: number;
  map: {
    wdpaId: string;
    bounds: [number, number, number, number];
  };
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
    // fishingProtectionLevel: fishingProtectionLevelOptions,
  } = useFiltersOptions();

  const tooltips = useTooltips();

  // Define columns
  const columns: ColumnDef<NationalHighseasTableColumns>[] = useMemo(() => {
    return [
      {
        accessorKey: 'protectedArea',
        header: ({ column }) => (
          <HeaderItem className="ml-6">
            <SortingButton column={column} />
            Name
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const {
            original: { protectedArea },
          } = row;
          return (
            <ExpansionControls row={row}>
              <span className="font-semibold">{protectedArea}</span>
            </ExpansionControls>
          );
        },
      },
      {
        accessorKey: 'map',
        header: null,
        cell: ({ row }) => {
          const { bounds, wdpaId } = row.original.map;

          return (
            <div className="relative -mr-0.5 h-[calc(100%+4px)] w-12 border-l border-r border-t border-b border-black">
              <LayerPreview bounds={bounds} wdpaId={wdpaId} />
            </div>
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
        accessorKey: 'protectedAreaType',
        header: ({ column }) => (
          <HeaderItem>
            <FiltersButton
              field={column.id}
              options={protectionStatusOptions}
              values={filters[column.id]}
              onChange={onFiltersChange}
            />
            Type
            <TooltipButton column={column} tooltips={tooltips} />
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
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { establishmentStage: value } = row.original;
          const formattedValue =
            establishmentStageOptions.find((entry) => value === entry?.value)?.name || 'N/A';
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
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { protectionLevel: value } = row.original;
          const formattedValue =
            protectionLevelOptions.find((entry) => value === entry?.value)?.name || 'N/A';
          return <>{formattedValue}</>;
        },
      },
      // {
      //   accessorKey: 'fishingProtectionLevel',
      //   header: ({ column }) => (
      //     <HeaderItem>
      //       <FiltersButton
      //         field={column.id}
      //         options={fishingProtectionLevelOptions}
      //         values={filters[column.id]}
      //         onChange={onFiltersChange}
      //       />
      //       Level of Fishing Protection
      //       <TooltipButton column={column} tooltips={tooltips} />
      //     </HeaderItem>
      //   ),
      //   cell: ({ row }) => {
      //     const { fishingProtectionLevel: value } = row.original;
      //     const formattedValue =
      //       fishingProtectionLevelOptions.find((entry) => value === entry?.value)?.name || 'N/A';
      //     return <>{formattedValue}</>;
      //   },
      // },
    ];
  }, [
    filters,
    onFiltersChange,
    tooltips,
    protectionStatusOptions,
    establishmentStageOptions,
    protectionLevelOptions,
    // fishingProtectionLevelOptions,
  ]);

  return columns;
};

export default useColumns;
