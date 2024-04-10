import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { PROTECTION_TYPES_CHART_COLORS } from '@/constants/protection-types-chart-colors';
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
        mpaa_protection_level_stats: {
          populate: {
            mpaa_protection_level: '*',
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
        background: PROTECTION_TYPES_CHART_COLORS[protectionLevel.slug],
        totalArea: totalClassificationArea,
        protectedArea: stats?.area,
        info: protectionLevel.info,
      };
    };

    const protectionLevelStatsData =
      protectionLevelsData[0]?.attributes?.mpaa_protection_level_stats?.data;

    const totalClassificationArea = protectionLevelStatsData.reduce(
      (acc, entry) => acc + entry?.attributes?.area,
      0
    );

    const fullyHighlyProtectedLevelData = protectionLevelStatsData?.find(
      ({ attributes }) =>
        attributes?.mpaa_protection_level?.data?.attributes?.slug === 'fully-highly-protected'
    )?.attributes;

    const parsedFullyHighlyProtectedLevel = parsedProtectionLevel(
      'Fully or highly protected',
      fullyHighlyProtectedLevelData?.mpaa_protection_level?.data?.attributes,
      totalClassificationArea,
      fullyHighlyProtectedLevelData
    );

    return [parsedFullyHighlyProtectedLevel];
  }, [protectionLevelsData]);

  const noData = !widgetChartData;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title="Marine Conservation Protection Levels"
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
