import { useMemo } from 'react';

import { format } from 'd3-format';
import { groupBy } from 'lodash-es';

import ConservationChart from '@/components/charts/conservation-chart';
import Widget from '@/components/widget';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import type { Location } from '@/types/generated/strapi.schemas';

type MarineConservationWidgetProps = {
  location: Location;
};

const MarineConservationWidget: React.FC<MarineConservationWidgetProps> = ({ location }) => {
  const lastUpdated = 'October 2023';

  const { data: protectionStatsResponse } = useGetProtectionCoverageStats({
    populate: '*',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'sort[year]': 'asc',
    filters: {
      location: {
        code: location.code,
      },
      // protection_status: {
      //   slug: 'oecm', // oecm | mpa
      // },
    },
    'pagination[limit]': -1,
  });

  const protectionStats = useMemo(() => {
    return protectionStatsResponse?.data || [];
  }, [protectionStatsResponse?.data]);

  const mergedProtectionStats = useMemo(() => {
    if (!protectionStats.length) return null;

    const groupedByYear = groupBy(protectionStats, 'attributes.year');

    return Object.keys(groupedByYear).map((year) => {
      const entries = groupedByYear[year];
      const totalArea = entries.reduce(
        (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
        0
      );
      const protectedArea = entries.reduce((acc, entry) => acc + entry.attributes.protectedArea, 0);

      return {
        year: Number(year),
        totalArea,
        protectedArea,
      };
    });
  }, [protectionStats]);

  const stats = useMemo(() => {
    if (!mergedProtectionStats) return null;

    const lastYearData = mergedProtectionStats[mergedProtectionStats.length - 1];
    const { protectedArea, totalArea } = lastYearData;
    const percentageFormatted = format('.1r')((protectedArea * 100) / totalArea);
    const totalAreaFormatted = format(',.2r')(totalArea);

    return {
      protectedPercentage: percentageFormatted,
      totalArea: totalAreaFormatted,
    };
  }, [mergedProtectionStats]);

  const chartData = useMemo(() => {
    if (!mergedProtectionStats?.length) return [];

    const parsedData = mergedProtectionStats.map((entry, index) => {
      const isLastYear = index === mergedProtectionStats.length - 1;
      const { year, totalArea, protectedArea } = entry;
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
  }, [mergedProtectionStats]);

  if (!stats || !chartData) return null;

  return (
    <Widget title="Marine Conservation Coverage" lastUpdated={lastUpdated}>
      <div className="mt-6 mb-4 flex flex-col text-blue">
        <span className="text-5xl font-bold">
          {stats?.protectedPercentage}
          <span className="pl-1 text-lg">%</span>
        </span>
        <span className="text-lg">
          {stats?.totalArea} km<sup>2</sup>
        </span>
      </div>
      <ConservationChart className="-ml-8 aspect-[16/10]" data={chartData} />
    </Widget>
  );
};

export default MarineConservationWidget;
