import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { PROTECTION_TYPES_CHART_COLORS } from '@/constants/protection-types-chart-colors';
import { useGetLocations } from '@/types/generated/location';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import useTooltips from '../useTooltips';

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
          filters: {
            mpaa_protection_level: {
              slug: 'fully-highly-protected',
            },
          },
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

  const tooltips = useTooltips();

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!protectionLevelsData.length) return [];

    const parsedProtectionLevel = (label, protectionLevel, stats) => {
      return {
        title: label,
        slug: protectionLevel.slug,
        background: PROTECTION_TYPES_CHART_COLORS[protectionLevel.slug],
        totalArea: location.totalMarineArea,
        protectedArea: stats?.area,
        info: protectionLevel.info,
      };
    };

    const parsedMpaaProtectionLevelData =
      protectionLevelsData[0]?.attributes?.mpaa_protection_level_stats?.data?.map((entry) => {
        const stats = entry?.attributes;
        const protectionLevel = stats?.mpaa_protection_level?.data.attributes;
        return parsedProtectionLevel('Fully or highly protected', protectionLevel, stats);
      });

    return parsedMpaaProtectionLevelData;
  }, [location, protectionLevelsData]);

  const noData = !widgetChartData.length;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title="Marine Conservation Protection Levels"
      tooltip={tooltips?.['protectionTypes']}
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
