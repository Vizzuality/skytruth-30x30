import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { FISHING_PROTECTION_CHART_COLORS } from '@/constants/fishing-protection-chart-colors';
import { useGetDataInfos } from '@/types/generated/data-info';
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
          filters: {
            fishing_protection_level: {
              slug: 'highly',
            },
          },
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

  const { data: metadataWidget } = useGetDataInfos(
    {
      filters: {
        slug: 'fishing-protection-widget',
      },
      populate: 'data_sources',
    },
    {
      query: {
        select: ({ data }) =>
          data[0]
            ? {
                info: data[0].attributes.content,
                sources: data[0].attributes?.data_sources?.data?.map(
                  ({ attributes: { title, url } }) => ({
                    title,
                    url,
                  })
                ),
              }
            : undefined,
      },
    }
  );

  const { data: metadata } = useGetDataInfos(
    {
      filters: {
        slug: 'fishing-protection-level',
      },
      populate: 'data_sources',
    },
    {
      query: {
        select: ({ data }) =>
          data[0]
            ? {
                info: data[0]?.attributes?.content,
                sources: data[0]?.attributes?.data_sources?.data?.map(
                  ({ attributes: { title, url } }) => ({
                    title,
                    url,
                  })
                ),
              }
            : undefined,
      },
    }
  );

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!protectionLevelsData.length) return [];

    const parsedProtectionLevel = (label, protectionLevel, stats) => {
      return {
        title: label,
        slug: protectionLevel.slug,
        background: FISHING_PROTECTION_CHART_COLORS[protectionLevel.slug],
        totalArea: location.totalMarineArea,
        protectedArea: stats?.area,
        info: metadata?.info,
        sources: metadata?.sources,
      };
    };

    const parsedFishingProtectionLevelData =
      protectionLevelsData[0]?.attributes?.fishing_protection_level_stats?.data?.map((entry) => {
        const stats = entry?.attributes;
        const protectionLevel = stats?.fishing_protection_level?.data.attributes;
        return parsedProtectionLevel('Highly protected from fishing', protectionLevel, stats);
      });

    return parsedFishingProtectionLevelData;
  }, [location, protectionLevelsData, metadata]);

  const noData = !widgetChartData.length;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title="Fishing Protection"
      lastUpdated={protectionLevelsData[0]?.attributes?.updatedAt}
      noData={noData}
      loading={loading}
      info={metadataWidget?.info}
      sources={metadataWidget?.sources}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart key={chartData.slug} className="py-2" data={chartData} />
      ))}
    </Widget>
  );
};

export default ProtectionTypesWidget;
