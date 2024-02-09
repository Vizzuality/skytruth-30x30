import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { PROTECTION_TYPES_CHART_COLORS } from '@/constants/protection-types-chart-colors';
import { useGetFishingProtectionLevelStats } from '@/types/generated/fishing-protection-level-stat';
import { useGetMpaaProtectionLevelStats } from '@/types/generated/mpaa-protection-level-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type ProtectionTypesWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const ProtectionTypesWidget: React.FC<ProtectionTypesWidgetProps> = ({ location }) => {
  // Default filter by location
  const defaultFilters = {
    location: {
      code: location.code,
    },
  };

  // Find last updated in order to display the last data update
  const { data: dataLastUpdate, isFetching: isFetchingDataLastUpdate } =
    useGetMpaaProtectionLevelStats(
      {
        filters: defaultFilters,
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

  // Get fully or highly protected
  const {
    data: { data: protectionLevelStatsData },
    isFetching: isFetchingProtectionStatsData,
  } = useGetMpaaProtectionLevelStats(
    {
      filters: {
        ...defaultFilters,
        mpaa_protection_level: {
          slug: 'fully-highly-protected',
        },
      },
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

  // Get highly protected from fishing
  const {
    data: { data: fishingProtectionLevelStatsData },
    isFetching: isFetchingFishingProtectionStatsData,
  } = useGetFishingProtectionLevelStats(
    {
      filters: {
        ...defaultFilters,
        fishing_protection_level: {
          slug: 'highly',
        },
      },
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
    const parsedMpaaProtectionLevelData = protectionLevelStatsData.map((entry) => {
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

    const parsedFishingProtectionLevelData = fishingProtectionLevelStatsData.map((entry) => {
      const stats = entry?.attributes;
      const protectionLevel = stats?.fishing_protection_level?.data.attributes;

      return {
        title: protectionLevel.name,
        slug: protectionLevel.slug,
        background: PROTECTION_TYPES_CHART_COLORS[protectionLevel.slug],
        totalArea: location.totalMarineArea,
        protectedArea: stats.area,
        info: protectionLevel.info,
      };
    });

    return [...parsedMpaaProtectionLevelData, ...parsedFishingProtectionLevelData];
  }, [location, protectionLevelStatsData, fishingProtectionLevelStatsData]);

  const noData = !widgetChartData.length;
  const loading =
    isFetchingProtectionStatsData ||
    isFetchingFishingProtectionStatsData ||
    isFetchingDataLastUpdate;

  return (
    <Widget
      title="Marine Conservation Protection Levels"
      lastUpdated={dataLastUpdate}
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
