import { useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { FISHING_PROTECTION_CHART_COLORS } from '@/constants/fishing-protection-chart-colors';
import { FCWithMessages } from '@/types';
import { useGetDataInfos } from '@/types/generated/data-info';
import { useGetLocations } from '@/types/generated/location';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type FishingProtectionWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const FishingProtectionWidget: FCWithMessages<FishingProtectionWidgetProps> = ({ location }) => {
  const t = useTranslations('containers.map-sidebar-main-panel');
  const locale = useLocale();

  // Get protection levels data for the location
  const {
    data: { data: protectionLevelsData },
    isFetching: isFetchingProtectionLevelsData,
  } = useGetLocations(
    {
      // We will use the data from the `localizations` field because the model “Fishing Protection
      // Level Stats” is not localised and its relationship to the “Location” model only points to
      // a specific localised version. As such, we're forced to load all the locales of the
      // “Location” model and then figure out which version has the relation to the other model.
      locale: 'en',
      filters: {
        code: location?.code,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        // This part is for the English version only
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
        // This part is for the Spanish and French versions
        localizations: {
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
      locale,
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
      locale,
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

    const parsedProtectionLevel = (label: string, protectionLevel, stats) => {
      return {
        title: label,
        slug: protectionLevel.slug,
        background: FISHING_PROTECTION_CHART_COLORS[protectionLevel.slug],
        totalArea: (stats?.area / stats?.pct) * 100,
        protectedArea: stats?.area,
        info: metadata?.info,
        sources: metadata?.sources,
      };
    };

    const fishingProtectionLevelStats = [
      protectionLevelsData[0]?.attributes?.fishing_protection_level_stats.data,
      ...(protectionLevelsData[0]?.attributes?.localizations.data?.map(
        // The types below are wrong. There is definitely an `attributes` key inside
        // `localizations`.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (localization) => localization.attributes.fishing_protection_level_stats.data
      ) ?? []),
    ].find((data) => data?.length);

    const parsedFishingProtectionLevelData = fishingProtectionLevelStats?.map((stats) => {
      const data = stats?.attributes;
      const protectionLevel = data?.fishing_protection_level?.data.attributes;
      return parsedProtectionLevel(t('highly-protected-from-fishing'), protectionLevel, data);
    });

    return parsedFishingProtectionLevelData ?? [];
  }, [t, protectionLevelsData, metadata]);

  const noData = !widgetChartData.length;

  const loading = isFetchingProtectionLevelsData;

  return (
    <Widget
      title={t('fishing-protection')}
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

FishingProtectionWidget.messages = [
  'containers.map-sidebar-main-panel',
  ...Widget.messages,
  ...HorizontalBarChart.messages,
];

export default FishingProtectionWidget;
