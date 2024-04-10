import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { FISHING_PROTECTION_CHART_COLORS } from '@/constants/fishing-protection-chart-colors';
import { useGetLocations } from '@/types/generated/location';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type ProtectionTypesWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const ProtectionTypesWidget: React.FC<ProtectionTypesWidgetProps> = ({ location }) => {
  // Get protection levels data for the location
  const {
    data: { data: protectionLevelsData },
    isFetching: isFetchingProtectionLevelsData,
  } = useGetLocations(
    {
      filters: {
        code: location?.code,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        fishing_protection_level_stats: {
          populate: {
            fishing_protection_level: '*',
          },
        },
      },
      'pagination[limit]': -1,
    },
    {
      query: {
        enabled: Boolean(location?.code),
        select: ({ data }) => ({ data }),
        placeholderData: { data: [] },
        refetchOnWindowFocus: false,
      },
    }
  );

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!protectionLevelsData.length) return [];

    const parsedProtectionLevel = (label, protectionLevel, totalClassificationArea, stats) => {
      return {
        title: label,
        slug: protectionLevel.slug,
        background: FISHING_PROTECTION_CHART_COLORS[protectionLevel.slug],
        totalArea: totalClassificationArea,
        protectedArea: stats?.area,
        info: protectionLevel.info,
      };
    };

    const protectionLevelStatsData =
      protectionLevelsData[0]?.attributes?.fishing_protection_level_stats?.data;

    const totalClassificationArea = protectionLevelStatsData.reduce(
      (acc, entry) => acc + entry?.attributes?.area,
      0
    );

    const highlyProtectedLevelData = protectionLevelStatsData?.find(
      ({ attributes }) => attributes?.fishing_protection_level?.data?.attributes?.slug === 'highly'
    )?.attributes;

    const parsedHighlyProtectedLevel = parsedProtectionLevel(
      'Highly protected from fishing',
      highlyProtectedLevelData?.fishing_protection_level?.data?.attributes,
      totalClassificationArea,
      highlyProtectedLevelData
    );

    return [parsedHighlyProtectedLevel];
  }, [protectionLevelsData]);

  const noData = !widgetChartData.length;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title="Fishing Protection"
      lastUpdated={protectionLevelsData[0]?.attributes?.updatedAt}
      noData={noData}
      loading={loading}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart key={chartData.slug} className="py-2" data={chartData} />
      ))}
    </Widget>
  );
};

export default ProtectionTypesWidget;
