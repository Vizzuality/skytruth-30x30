import { PropsWithChildren, useMemo } from 'react';

import theme from 'lib/tailwind';

import { useQueries } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import StackedHorizontalBarChart from '@/components/charts/stacked-horizontal-bar-chart';
import TooltipButton from '@/components/tooltip-button';
import Widget from '@/components/widget';
import { modellingAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import {
  getGetProtectionCoverageStatsQueryOptions,
  useGetProtectionCoverageStats,
} from '@/types/generated/protection-coverage-stat';

import useTooltips from '../useTooltips';

const DEFAULT_ENTRY_CLASSNAMES = 'border-t border-black py-6';

const DEFAULT_CHART_PROPS = {
  className: 'py-2',
  showLegend: false,
  showTarget: false,
};

type WidgetSectionWidgetTitleProps = PropsWithChildren<{
  title: string;
  tooltip?: string;
}>;

const WidgetSectionWidgetTitle: React.FC<WidgetSectionWidgetTitleProps> = ({ title, tooltip }) => {
  return (
    <div className="flex items-center">
      <span className="font-mono text-xs uppercase">{title}</span>
      {tooltip && <TooltipButton className="-mt-1" text={tooltip} />}
    </div>
  );
};

const WidgetLegend: React.FC = () => {
  const LEGEND_LINE_CLASSES =
    'relative pl-9 font-mono text-xs before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-[28px] before:-translate-y-1/2';

  return (
    <ul>
      <li>
        <span className={cn(LEGEND_LINE_CLASSES, 'before:bg-green')}>
          Existing marine conservation coverage
        </span>
      </li>
      <li>
        <span className={cn(LEGEND_LINE_CLASSES, 'before:bg-black')}>New added area</span>
      </li>
    </ul>
  );
};

const ModellingWidget: React.FC = () => {
  const chartsProps = DEFAULT_CHART_PROPS;

  const { status: modellingStatus, data: modellingData } = useAtomValue(modellingAtom);

  // Tooltips with mapping
  const tooltips = useTooltips();

  const { data: globalProtectionStatsData } = useGetProtectionCoverageStats(
    {
      filters: {
        location: {
          code: 'GLOB',
        },
      },
      populate: '*',
      // @ts-expect-error this is an issue with Orval typing
      'sort[year]': 'asc',
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) => {
          if (!data) return null;

          const latestYearAvailable = data[data.length - 1]?.attributes.year;

          const lastYearData = data.filter(
            ({ attributes }) => attributes.year === latestYearAvailable
          );

          const protectedArea = lastYearData.reduce(
            (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
            0
          );

          const totalArea =
            lastYearData?.[0].attributes?.location?.data?.attributes?.totalMarineArea || 0;

          return {
            protectedArea,
            percentageProtectedArea: (protectedArea / totalArea) * 100,
            totalArea,
          };
        },
        refetchOnWindowFocus: false,
      },
    }
  );

  const locationQueries = useQueries({
    queries: (modellingData?.locations_area || []).map((location) =>
      getGetProtectionCoverageStatsQueryOptions(
        {
          filters: {
            location: {
              code: location.code,
            },
          },
          populate: '*',
          // @ts-expect-error this is an issue with Orval typing
          'sort[year]': 'asc',
          'pagination[limit]': -1,
        },
        {
          query: {
            enabled: Boolean(modellingData?.locations_area),
            select: ({ data }) => {
              if (!data) return null;

              const latestYearAvailable = data[data.length - 1]?.attributes.year;

              const lastYearData = data.filter(
                ({ attributes }) => attributes.year === latestYearAvailable
              );

              const protectedArea = lastYearData.reduce(
                (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
                0
              );

              const totalArea =
                lastYearData?.[0].attributes?.location?.data?.attributes?.totalMarineArea || 0;

              return {
                protectedArea,
                percentageProtectedArea: (protectedArea / totalArea) * 100,
                location: lastYearData?.[0].attributes?.location?.data?.attributes,
                totalArea,
              };
            },
            refetchOnWindowFocus: false,
          },
        }
      )
    ),
  });

  const loading = modellingStatus === 'running';
  const error = modellingStatus === 'error';

  const nationalLevelContributions = useMemo(() => {
    return locationQueries.map((query) => {
      if (query.status === 'loading') return null;

      const totalCustomArea = modellingData.locations_area.find(
        ({ code }) => code === query.data.location.code
      ).protected_area;

      const totalCustomAreaPercentage =
        (totalCustomArea / modellingData.total_protected_area) * 100;

      return {
        ...query.data,
        totalCustomArea,
        totalCustomAreaPercentage,
      };
    });
  }, [locationQueries, modellingData]);

  const administrativeBoundaries = nationalLevelContributions?.map(
    (contribution) => contribution?.location?.name
  );

  return (
    <Widget
      className="border-b border-black py-0"
      noData={!nationalLevelContributions}
      loading={loading}
      error={error}
    >
      <div className="flex flex-col">
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES, 'flex justify-between border-t-0')}>
          <WidgetSectionWidgetTitle
            title="Administrative boundary"
            tooltip={tooltips?.['administrativeBoundary']}
          />
          <span className="text-right font-mono text-xs font-bold underline">
            {administrativeBoundaries?.[0]}{' '}
            {administrativeBoundaries?.length > 1 && `+${administrativeBoundaries?.length - 1}`}
          </span>
        </div>
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES)}>
          <div className="space-y-2">
            <WidgetSectionWidgetTitle
              title="National level contribution"
              tooltip={tooltips?.['contributionDetails']}
            />
            <WidgetLegend />
          </div>
          {nationalLevelContributions?.map((contribution) => (
            <StackedHorizontalBarChart
              key={contribution?.location?.code}
              title={contribution?.location?.name}
              totalArea={contribution?.totalArea}
              highlightedPercentage={contribution?.totalCustomAreaPercentage}
              data={[
                {
                  background: theme.colors.green as string,
                  total: contribution?.protectedArea,
                  totalPercentage: contribution?.percentageProtectedArea,
                },
                {
                  background: theme.colors.black as string,
                  total: contribution?.totalCustomArea,
                  totalPercentage: contribution?.totalCustomAreaPercentage,
                },
              ]}
              {...chartsProps}
            />
          ))}
        </div>
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES)}>
          <div className="space-y-2">
            <WidgetSectionWidgetTitle
              title="Global level contribution"
              tooltip={tooltips?.['globalContribution']}
            />
            <WidgetLegend />
          </div>
          <StackedHorizontalBarChart
            title="Global"
            totalArea={globalProtectionStatsData?.totalArea}
            highlightedPercentage={
              (modellingData?.total_protected_area / globalProtectionStatsData?.protectedArea) * 100
            }
            data={[
              {
                background: theme.colors.green as string,
                total: globalProtectionStatsData?.protectedArea,
                totalPercentage: globalProtectionStatsData?.percentageProtectedArea,
              },
              {
                background: theme.colors.black as string,
                total: modellingData?.total_protected_area,
                totalPercentage:
                  (modellingData?.total_protected_area / globalProtectionStatsData?.protectedArea) *
                  100,
              },
            ]}
            {...chartsProps}
          />
        </div>
      </div>
    </Widget>
  );
};

export default ModellingWidget;
