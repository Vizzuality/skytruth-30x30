import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { PROTECTION_TYPES_CHART_COLORS } from '@/constants/protection-types-chart-colors';
import { useGetMpaaProtectionLevelStats } from '@/types/generated/mpaa-protection-level-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type ProtectionTypesWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const ProtectionTypesWidget: React.FC<ProtectionTypesWidgetProps> = ({ location }) => {
  // Default params: filter by location
  const defaultQueryParams = {
    filters: {
      location: {
        code: location.code,
      },
    },
  };

  // Find last updated in order to display the last data update
  const { data: dataLastUpdate, isFetching: isFetchingDataLastUpdate } =
    useGetMpaaProtectionLevelStats(
      {
        ...defaultQueryParams,
        sort: 'updatedAt:desc',
        'pagination[limit]': 1,
      },
      {
        query: {
          select: ({ data }) => data?.[0]?.attributes?.updatedAt,
          placeholderData: { data: null },
          refetchOnWindowFocus: false,
        },
      }
    );

  // Get protection levels by location
  const {
    data: { data: protectionLevelStatsData },
    isFetching: isFetchingProtectionStatsData,
  } = useGetMpaaProtectionLevelStats(
    {
      ...defaultQueryParams,
      populate: '*',
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

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!protectionLevelStatsData.length) return [];

    const parsedData = protectionLevelStatsData.map((entry) => {
      const stats = entry?.attributes;
      const protectionLevel = stats?.mpaa_protection_level?.data.attributes;

      return {
        title: protectionLevel.name,
        slug: protectionLevel.slug,
        background: PROTECTION_TYPES_CHART_COLORS[protectionLevel.slug],
        totalArea: location.totalMarineArea,
        protectedArea: stats.area,
        info: protectionLevel.info,
      };
    });

    return parsedData;
  }, [location, protectionLevelStatsData]);

  const noData = !widgetChartData.length;
  const loading = isFetchingProtectionStatsData || isFetchingDataLastUpdate;

  return (
    <Widget
      title="Marine Conservation Protection Types"
      lastUpdated={dataLastUpdate}
      source="protection-types-widget"
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
