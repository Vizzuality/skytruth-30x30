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
        code: location.code,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        mpaa_protection_level_stats: {
          populate: {
            mpaa_protection_level: '*',
          },
        },
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
        select: ({ data }) => ({ data }),
        placeholderData: { data: [] },
        refetchOnWindowFocus: false,
      },
    }
  );

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!protectionLevelsData.length) return [];

    const parsedProtectionLevel = (label, property, data) => {
      const attributes = data[0]?.attributes;
      const propertyData = attributes[property].data?.attributes;

      return {
        title: label,
        slug: propertyData?.slug,
        background: PROTECTION_TYPES_CHART_COLORS[propertyData?.slug],
        totalArea: location.totalMarineArea,
        protectedArea: attributes.area,
        info: propertyData?.info,
      };
    };

    const parsedMpaaProtectionLevelData = parsedProtectionLevel(
      'Fully or highly protected',
      'mpaa_protection_level',
      protectionLevelsData[0]?.attributes?.mpaa_protection_level_stats?.data?.filter(
        (entry) =>
          entry?.attributes?.mpaa_protection_level?.data?.attributes?.slug ===
          'fully-highly-protected'
      )
    );

    const parsedHighlyProtectedFromFishingData = parsedProtectionLevel(
      'Highly protected from fishing',
      'fishing_protection_level',
      protectionLevelsData[0]?.attributes?.fishing_protection_level_stats?.data?.filter(
        (entry) => entry?.attributes?.fishing_protection_level?.data?.attributes?.slug === 'highly'
      )
    );
    return [parsedMpaaProtectionLevelData, parsedHighlyProtectedFromFishingData];
  }, [location, protectionLevelsData]);

  const noData = !widgetChartData.length;
  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title="Marine Conservation Protection Levels"
      lastUpdated={protectionLevelsData[0]?.attributes?.updatedAt}
      noData={noData}
      loading={loading}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart
          key={chartData.slug}
          className="py-2"
          data={chartData}
          areaToDisplay="protected-area"
        />
      ))}
    </Widget>
  );
};

export default ProtectionTypesWidget;
