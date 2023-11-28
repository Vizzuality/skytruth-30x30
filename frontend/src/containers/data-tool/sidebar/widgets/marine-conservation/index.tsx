import { useMemo } from 'react';

import { groupBy } from 'lodash-es';

import ConservationChart from '@/components/charts/conservation-chart';
import Widget from '@/components/widget';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type MarineConservationWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const MarineConservationWidget: React.FC<MarineConservationWidgetProps> = ({ location }) => {
  const defaultQueryParams = {
    filters: {
      location: {
        code: location.code,
      },
    },
  };

  const { data: dataLastUpdate } = useGetProtectionCoverageStats(
    {
      ...defaultQueryParams,
      sort: 'updatedAt:desc',
      'pagination[limit]': 1,
    },
    {
      query: {
        select: ({ data }) => data?.[0]?.attributes?.updatedAt,
        placeholderData: { data: null },
      },
    }
  );

  const {
    data: { data: protectionStatsData },
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
    const formatter = Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    });
    const percentageFormatted = formatter.format((protectedArea / totalArea) * 100);
    const totalAreaFormatted = Intl.NumberFormat('en-US', {
      notation: 'standard',
    }).format(totalArea);

    return {
      protectedPercentage: percentageFormatted,
      totalArea: totalAreaFormatted,
    };
  }, [location, mergedProtectionStats]);

  const chartData = useMemo(() => {
    if (!mergedProtectionStats?.length) return [];

    const totalArea = location.totalMarineArea;
    const parsedData = mergedProtectionStats.map((entry, index) => {
      const isLastYear = index === mergedProtectionStats.length - 1;
      const { year, protectedArea } = entry;
      const percentage = Math.round((protectedArea * 100) / totalArea);

      return {
        // We only want to show up to 55%, so we'll cap the percentage here
        // Some of the data seems incorrect; this is a quick fix in order to not blow the chart
        percentage: percentage > 55 ? 55 : percentage,
        year,
        active: isLastYear,
        totalArea: totalArea,
        protectedArea,
        future: false,
      };
    });

    const lastEntryYear = parsedData[parsedData.length - 1]?.year;
    const missingYearsArr = [...Array(2030 - lastEntryYear).keys()].map(
      (i) => i + lastEntryYear + 1
    );

    const missingYearsData = missingYearsArr.map((year) => {
      return {
        percentage: 0,
        year: year,
        active: false,
        totalArea: null,
        protectedArea: null,
        future: true,
      };
    });

    const mergedData = [...parsedData, ...missingYearsData];

    // Cap results to the least 20 entries, or chart will be too big
    return mergedData.slice(-20);
  }, [location, mergedProtectionStats]);

  if (!stats || !chartData) return null;

  return (
    <Widget
      title="Marine Conservation Coverage"
      lastUpdated={dataLastUpdate}
      source="marine-conservation-widget"
    >
      <div className="mt-6 mb-4 flex flex-col text-blue">
        <span className="space-x-1">
          <span className="text-[64px] font-bold leading-[80%]">{stats.protectedPercentage}</span>
          <span className="text-lg">%</span>
        </span>
        <span className="space-x-1 text-lg  ">
          <span>{stats.totalArea}</span>
          <span>
            km<sup>2</sup>
          </span>
        </span>
      </div>
      <ConservationChart className="-ml-8 aspect-[16/10]" data={chartData} />
    </Widget>
  );
};

export default MarineConservationWidget;
