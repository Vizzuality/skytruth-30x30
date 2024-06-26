import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import FiltersButton from '@/components/filters-button';
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
};

type UseColumnsProps = {
  filters: { [key: string]: string[] };
  onFiltersChange: (field: string, values: string[]) => void;
};

const useColumns = ({ filters, onFiltersChange }: UseColumnsProps) => {
  const t = useTranslations('containers.map');

  const { locale } = useRouter();

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
          <HeaderItem>
            <SortingButton column={column} />
            {t('name')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
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
            {t('coverage')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { coverage: value } = row.original;
          if (!value) return <>&mdash;</>;

          const formattedCoverage = cellFormatter.percentage(locale, value);

          return (
            <span className="text-4xl font-bold">
              {t.rich('percentage-bold', {
                b1: (chunks) => chunks,
                b2: (chunks) => <span className="text-xs">{chunks}</span>,
                percentage: formattedCoverage,
              })}
            </span>
          );
        },
      },
      {
        accessorKey: 'area',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            {t('area')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { area: value } = row.original;
          const formattedValue = cellFormatter.area(locale, value);
          return <span>{t('area-km2', { area: formattedValue })}</span>;
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
            {t('type')}
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
            {t('establishment-stage')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { establishmentStage: value } = row.original;
          const formattedValue =
            establishmentStageOptions.find((entry) => value === entry?.value)?.name || t('n-a');
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
            {t('protection-level')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { protectionLevel: value } = row.original;
          const formattedValue =
            protectionLevelOptions.find((entry) => value === entry?.value)?.name || t('n-a');
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
      //       {t('level-fishing-protection')}
      //       <TooltipButton column={column} tooltips={tooltips} />
      //     </HeaderItem>
      //   ),
      //   cell: ({ row }) => {
      //     const { fishingProtectionLevel: value } = row.original;
      //     const formattedValue =
      //       fishingProtectionLevelOptions.find((entry) => value === entry?.value)?.name || t('n-a');
      //     return <>{formattedValue}</>;
      //   },
      // },
    ];
  }, [
    t,
    tooltips,
    locale,
    protectionStatusOptions,
    filters,
    onFiltersChange,
    establishmentStageOptions,
    protectionLevelOptions,
  ]);

  return columns;
};

export default useColumns;
