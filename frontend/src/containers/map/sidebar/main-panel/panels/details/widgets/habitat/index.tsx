import { useLocale, useTranslations } from 'next-intl';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { HABITAT_CHART_COLORS } from '@/constants/habitat-chart-colors';
import { FCWithMessages } from '@/types';
import { useGetDataInfos } from '@/types/generated/data-info';
import { useGetHabitatStats } from '@/types/generated/habitat-stat';
import type {
  HabitatStatHabitatData,
  LocationGroupsDataItemAttributes,
} from '@/types/generated/strapi.schemas';

type HabitatWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const HabitatWidget: FCWithMessages<HabitatWidgetProps> = ({ location }) => {
  const t = useTranslations('containers.map-sidebar-main-panel');
  const locale = useLocale();

  const defaultQueryParams = {
    filters: {
      location: {
        code: location?.code,
      },
    },
  };

  const { data: dataLastUpdate, isFetching: isFetchingDataLastUpdate } = useGetHabitatStats(
    {
      ...defaultQueryParams,
      locale,
      fields: 'updatedAt',
      sort: 'updatedAt:desc',
      'pagination[limit]': 1,
    },
    {
      query: {
        enabled: Boolean(location?.code),
        select: ({ data }) => data?.[0]?.attributes?.updatedAt,
        placeholderData: { data: null },
        refetchOnWindowFocus: false,
      },
    }
  );

  const { data: habitatMetadatas } = useGetDataInfos(
    {
      locale,
      filters: {
        slug: [
          'cold-water corals',
          'warm-water corals',
          'mangroves',
          'seagrasses',
          'saltmarshes',
          'mangroves',
          'seamounts',
        ],
      },
      populate: 'data_sources',
    },
    {
      query: {
        select: ({ data }) =>
          data
            ? data.map((item) => ({
                slug: item.attributes.slug,
                info: item.attributes.content,
                sources: item.attributes?.data_sources?.data?.map(
                  ({ attributes: { title, url } }) => ({
                    title,
                    url,
                  })
                ),
              }))
            : undefined,
      },
    }
  );

  const { data: widgetChartData, isFetching: isFetchingHabitatStatsData } = useGetHabitatStats(
    {
      ...defaultQueryParams,
      locale,
      populate: 'habitat,habitat.localizations',
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) => {
          const parsedData = data.map((entry) => {
            const stats = entry?.attributes;

            let habitat = stats?.habitat?.data.attributes;
            if (habitat.locale !== locale) {
              habitat = (habitat.localizations.data as HabitatStatHabitatData[]).find(
                (localization) => localization.attributes.locale === locale
              )?.attributes;
            }

            const metadata = habitatMetadatas?.find(({ slug }) => slug === habitat.slug);

            return {
              title: habitat.name,
              slug: habitat.slug,
              background: HABITAT_CHART_COLORS[habitat.slug],
              totalArea: stats.totalArea,
              protectedArea: stats.protectedArea,
              info: metadata?.info,
              sources: metadata?.sources,
            };
          });

          return parsedData.reverse();
        },
        placeholderData: { data: [] },
        refetchOnWindowFocus: false,
      },
    }
  );

  // const { data: metadataWidget } = useGetDataInfos(
  //   {
  //     locale,
  //     filters: {
  //       slug: 'habitats-widget',
  //     },
  //     populate: 'data_sources',
  //   },
  //   {
  //     query: {
  //       select: ({ data }) =>
  //         data[0]
  //           ? {
  //               info: data[0].attributes.content,
  //               sources: data[0].attributes?.data_sources?.data?.map(
  //                 ({ attributes: { title, url } }) => ({
  //                   title,
  //                   url,
  //                 })
  //               ),
  //             }
  //           : undefined,
  //     },
  //   }
  // );

  const noData = !widgetChartData.length;
  const loading = isFetchingHabitatStatsData || isFetchingDataLastUpdate;

  return (
    <Widget
      title={t('proportion-habitat-within-protected-areas')}
      lastUpdated={dataLastUpdate}
      noData={noData}
      loading={loading}
      // info={metadataWidget?.info}
      // sources={metadataWidget?.sources}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart
          key={chartData.slug}
          className="py-2"
          data={chartData}
          showTarget={false}
        />
      ))}
    </Widget>
  );
};

HabitatWidget.messages = [
  'containers.map-sidebar-main-panel',
  ...Widget.messages,
  ...HorizontalBarChart.messages,
];

export default HabitatWidget;
