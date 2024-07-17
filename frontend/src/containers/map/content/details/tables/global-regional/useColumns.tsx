import { useMemo } from 'react';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('containers.map');
  const locale = useLocale();

  const searchParams = useMapSearchParams();
  const tooltips = useTooltips();

  const columns: ColumnDef<GlobalRegionalTableColumns>[] = useMemo(() => {
    return [
      {
        accessorKey: 'location',
        header: ({ column }) => (
          <HeaderItem className="ml-1">
            <SortingButton column={column} />
            {t('name')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { location, locationCode } = row.original;
          return (
            <HeaderItem>
              <Link
                className="font-semibold underline"
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
            {t('coverage')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { coverage: value } = row.original;
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
        accessorKey: 'mpas',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            {t('mpas')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { mpas: value } = row.original;
          if (Number.isNaN(value)) return t('n-a');

          const formattedValue = cellFormatter.percentage(locale, value);
          return <span className="text-xs">{t('percentage', { percentage: formattedValue })}</span>;
        },
      },
      {
        accessorKey: 'oecms',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            {t('oecms')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { oecms: value } = row.original;
          if (Number.isNaN(value)) return t('n-a');

          const formattedValue = cellFormatter.percentage(locale, value);
          return <span className="text-xs">{t('percentage', { percentage: formattedValue })}</span>;
        },
      },
      {
        accessorKey: 'fullyHighlyProtected',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            {t('fully-highly-protected')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { fullyHighlyProtected: value } = row.original;
          const formattedValue = cellFormatter.percentage(locale, value);
          return <span className="text-xs">{t('percentage', { percentage: formattedValue })}</span>;
        },
      },
      // {
      //   accessorKey: 'highlyProtectedLfp',
      //   header: ({ column }) => (
      //     <HeaderItem>
      //       <SortingButton column={column} />
      //       {t('highly-protected-lfp')}
      //       <TooltipButton column={column} tooltips={tooltips} />
      //     </HeaderItem>
      //   ),
      //   cell: ({ row }) => {
      //     const { highlyProtectedLfp: value } = row.original;
      //     if (!value) return <>No data</>;
      //     const formattedValue = cellFormatter.percentage(locale, value);
      //     return <span className="text-xs">{t('percentage', { percentage: formattedValue })}</span>;
      //   },
      // },
      {
        accessorKey: 'globalContribution',
        header: ({ column }) => (
          <HeaderItem>
            <SortingButton column={column} />
            {t('global-contribution')}
            <TooltipButton column={column} tooltips={tooltips} />
          </HeaderItem>
        ),
        cell: ({ row }) => {
          const { globalContribution: value } = row.original;
          if (!value) return t('no-data');
          const formattedValue = cellFormatter.percentage(locale, value);
          return <span className="text-xs">{t('percentage', { percentage: formattedValue })}</span>;
        },
      },
    ];
  }, [locale, searchParams, t, tooltips]);

  return columns;
};

export default useColumns;
