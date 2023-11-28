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
  const { data: dataLastUpdate } = useGetMpaaProtectionLevelStats(
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

  // Get protection levels by location
  const {
    data: { data: protectionLevelStatsData },
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
        barColor: PROTECTION_TYPES_CHART_COLORS[protectionLevel.slug],
        totalArea: location.totalMarineArea,
        protectedArea: stats.area,
        info: protectionLevel.info,
      };
    });

    return parsedData;
  }, [location, protectionLevelStatsData]);

  // If there's no widget data, don't display the widget
  if (!widgetChartData.length) return null;

  return (
    <Widget
      title="Marine Conservation Protection Types"
      lastUpdated={dataLastUpdate}
      source="protection-types-widget"
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart key={chartData.slug} className="py-2" data={chartData} />
      ))}
    </Widget>
  );
};

export default ProtectionTypesWidget;
