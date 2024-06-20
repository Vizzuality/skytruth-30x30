import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { PROTECTION_TYPES_CHART_COLORS } from '@/constants/protection-types-chart-colors';
import { FCWithMessages } from '@/types';
import { useGetDataInfos } from '@/types/generated/data-info';
import { useGetLocations } from '@/types/generated/location';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import { PROTECTION_LEVEL_NAME_SUBSTITUTIONS } from './constants';

type ProtectionTypesWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const ProtectionTypesWidget: FCWithMessages<ProtectionTypesWidgetProps> = ({ location }) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

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

  const { data: metadata } = useGetDataInfos(
    {
      filters: {
        slug: 'fully-highly-protected',
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

  // Go through all the relevant stats, find the last updated one's value
  const lastUpdated = useMemo(() => {
    const protectionLevelStats =
      protectionLevelsData[0]?.attributes?.mpaa_protection_level_stats?.data;
    const updatedAtValues = protectionLevelStats?.reduce(
      (acc, curr) => [...acc, curr?.attributes?.updatedAt],
      []
    );

    return updatedAtValues?.sort()?.reverse()?.[0];
  }, [protectionLevelsData]);

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
        info: metadata?.info,
        sources: metadata?.sources,
      };
    };

    const parsedMpaaProtectionLevelData =
      protectionLevelsData[0]?.attributes?.mpaa_protection_level_stats?.data?.map((entry) => {
        const stats = entry?.attributes;
        const protectionLevel = stats?.mpaa_protection_level?.data.attributes;
        const displayName =
          PROTECTION_LEVEL_NAME_SUBSTITUTIONS[protectionLevel.slug] || protectionLevel?.name;
        return parsedProtectionLevel(displayName, protectionLevel, stats);
      });

    return parsedMpaaProtectionLevelData;
  }, [location, protectionLevelsData, metadata]);

  const noData = !widgetChartData.length;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title={t('marine-conservation-protection-levels')}
      lastUpdated={lastUpdated}
      noData={noData}
      loading={loading}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart
          key={chartData.slug}
          showTarget={location?.code === 'GLOB'}
          className="py-2"
          data={chartData}
        />
      ))}
    </Widget>
  );
};

ProtectionTypesWidget.messages = [
  'containers.map-sidebar-main-panel',
  ...Widget.messages,
  ...HorizontalBarChart.messages,
];

export default ProtectionTypesWidget;
