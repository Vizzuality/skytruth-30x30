import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { groupBy } from 'lodash-es';
import { useTranslations } from 'next-intl';

import ConservationChart from '@/components/charts/conservation-chart';
import Widget from '@/components/widget';
import { formatKM } from '@/lib/utils/formats';
import { formatPercentage } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';
import { useGetDataInfos } from '@/types/generated/data-info';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type MarineConservationWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const MarineConservationWidget: FCWithMessages<MarineConservationWidgetProps> = ({ location }) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

  const { locale } = useRouter();

  const defaultQueryParams = {
    filters: {
      location: {
        code: location?.code || 'GLOB',
      },
    },
  };

  const { data: dataLastUpdate, isFetching: isFetchingDataLastUpdate } =
    useGetProtectionCoverageStats(
      {
        ...defaultQueryParams,
        sort: 'updatedAt:desc',
        'pagination[limit]': 1,
      },
      {
        query: {
          enabled: Boolean(location?.code),
          select: ({ data }) => data?.[0]?.attributes?.updatedAt,
          placeholderData: { data: null },
          refetchOnWindowFocus: false,
        },
      }
    );

  const {
    data: { data: protectionStatsData },
    isFetching: isFetchingProtectionStatsData,
  } = useGetProtectionCoverageStats(
    {
      ...defaultQueryParams,
      populate: '*',
      // @ts-expect-error this is an issue with Orval typing
      'sort[year]': 'asc',
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) => ({ data }),
        placeholderData: { data: [] },
        refetchOnWindowFocus: false,
      },
    }
  );

  const mergedProtectionStats = useMemo(() => {
    if (!protectionStatsData.length) return null;

    const groupedByYear = groupBy(protectionStatsData, 'attributes.year');

    return Object.keys(groupedByYear).map((year) => {
      const entries = groupedByYear[year];
      const protectedArea = entries.reduce(
        (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
        0
      );

      return {
        year: Number(year),
        protectedArea,
      };
    });
  }, [protectionStatsData]);

  const { data: metadata } = useGetDataInfos(
    {
      filters: {
        slug: 'coverage-widget',
      },
      populate: 'data_sources',
    },
    {
      query: {
        select: ({ data }) =>
          data[0]
            ? {
                info: data[0].attributes.content,
                sources: data[0].attributes?.data_sources?.data?.map(
                  ({ attributes: { title, url } }) => ({
                    title,
                    url,
                  })
                ),
              }
            : undefined,
      },
    }
  );

  const stats = useMemo(() => {
    if (!mergedProtectionStats) return null;

    const totalArea = location.totalMarineArea;
    const lastYearData = mergedProtectionStats[mergedProtectionStats.length - 1];
    const { protectedArea } = lastYearData;
    const percentageFormatted = formatPercentage(locale, (protectedArea / totalArea) * 100, {
      displayPercentageSign: false,
    });
    const protectedAreaFormatted = formatKM(locale, protectedArea);
    const totalAreaFormatted = formatKM(locale, totalArea);

    return {
      protectedPercentage: percentageFormatted,
      protectedArea: protectedAreaFormatted,
      totalArea: totalAreaFormatted,
    };
  }, [locale, location, mergedProtectionStats]);

  const chartData = useMemo(() => {
    if (!mergedProtectionStats?.length) return [];

    const data = mergedProtectionStats.map((entry, index) => {
      const isLastYear = index === mergedProtectionStats.length - 1;
      const { year, protectedArea } = entry;
      const percentage = (protectedArea * 100) / location.totalMarineArea;

      return {
        // We only want to show up to 55%, so we'll cap the percentage here
        // Some of the data seems incorrect; this is a quick fix in order to not blow the chart
        percentage: percentage > 55 ? 55 : percentage,
        year,
        active: isLastYear,
        totalArea: location.totalMarineArea,
        protectedArea,
        future: false,
      };
    });

    return data;
  }, [location, mergedProtectionStats]);

  const noData = !chartData.length;
  const loading = isFetchingProtectionStatsData || isFetchingDataLastUpdate;
  const displayTarget = location?.code === 'GLOB';

  return (
    <Widget
      title={t('marine-conservation-coverage')}
      lastUpdated={dataLastUpdate}
      noData={noData}
      loading={loading}
      info={metadata?.info}
      sources={metadata?.sources}
    >
      {stats && (
        <div className="mt-6 mb-4 flex flex-col">
          <span className="space-x-1">
            {t.rich('marine-protected-percentage', {
              b1: (chunks) => <span className="text-[64px] font-bold leading-[80%]">{chunks}</span>,
              b2: (chunks) => <span className="text-lg">{chunks}</span>,
              percentage: stats?.protectedPercentage,
            })}
          </span>
          <span className="space-x-1 text-xs">
            <span>
              {t('marine-protected-area', {
                protectedArea: stats?.protectedArea,
                totalArea: stats?.totalArea,
              })}
            </span>
          </span>
        </div>
      )}
      <ConservationChart
        className="-ml-8 aspect-[16/10]"
        displayTarget={displayTarget}
        data={chartData}
      />
    </Widget>
  );
};

MarineConservationWidget.messages = [
  'containers.map-sidebar-main-panel',
  ...Widget.messages,
  ...ConservationChart.messages,
];

export default MarineConservationWidget;
