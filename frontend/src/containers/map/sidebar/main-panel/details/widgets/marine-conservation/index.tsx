import { useMemo } from 'react';

import { groupBy } from 'lodash-es';

import ConservationChart from '@/components/charts/conservation-chart';
import Widget from '@/components/widget';
import { formatKM } from '@/lib/utils/formats';
import { formatPercentage } from '@/lib/utils/formats';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type MarineConservationWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const MarineConservationWidget: React.FC<MarineConservationWidgetProps> = ({ location }) => {
  const defaultQueryParams = {
    filters: {
      location: {
        code: location?.code,
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

  const stats = useMemo(() => {
    if (!mergedProtectionStats) return null;

    const totalArea = location.totalMarineArea;
    const lastYearData = mergedProtectionStats[mergedProtectionStats.length - 1];
    const { protectedArea } = lastYearData;
    const percentageFormatted = formatPercentage((protectedArea / totalArea) * 100, {
      displayPercentageSign: false,
    });
    const protectedAreaFormatted = formatKM(protectedArea);

    return {
      protectedPercentage: percentageFormatted,
      protectedArea: protectedAreaFormatted,
    };
  }, [location, mergedProtectionStats]);

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

  return (
    <Widget
      title="Marine Conservation Coverage"
      lastUpdated={dataLastUpdate}
      noData={noData}
      loading={loading}
    >
      {stats && (
        <div className="mt-6 mb-4 flex flex-col text-blue">
          <span className="space-x-1">
            <span className="text-[64px] font-bold leading-[80%]">
              {stats?.protectedPercentage}
            </span>
            <span className="text-lg">%</span>
          </span>
          <span className="space-x-1 text-lg  ">
            <span>{stats?.protectedArea}</span>
            <span>
              km<sup>2</sup>
            </span>
          </span>
        </div>
      )}
      <ConservationChart className="-ml-8 aspect-[16/10]" data={chartData} />
    </Widget>
  );
};

export default MarineConservationWidget;
