import { useMemo } from 'react';

import { groupBy } from 'lodash-es';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { useGetMpaaEstablishmentStageStats } from '@/types/generated/mpaa-establishment-stage-stat';
import type { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

type EstablishmentStagesWidgetProps = {
  location: LocationGroupsDataItemAttributes;
};

const PATTERNS = {
  'proposed-committed': '/images/data-tool/chart-bgs/dots.svg',
  implemented: '/images/data-tool/chart-bgs/crosses.svg',
  'actively-managed': '/images/data-tool/chart-bgs/dashes.svg',
  designated: '/images/data-tool/chart-bgs/arrows.svg',
};

const EstablishmentStagesWidget: React.FC<EstablishmentStagesWidgetProps> = ({ location }) => {
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
    useGetMpaaEstablishmentStageStats(
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

  // Get establishment stages by location
  const {
    data: { data: establishmentStagesData },
    isFetching: isFetchingEstablishmentStagesData,
  } = useGetMpaaEstablishmentStageStats(
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

  // Merge OECM and MPA stats
  const mergedEstablishmentStagesStats = useMemo(() => {
    if (!establishmentStagesData.length) return [];

    const groupedByStage = groupBy(
      establishmentStagesData,
      'attributes.mpaa_establishment_stage.data.attributes.slug'
    );

    return Object.keys(groupedByStage).map((establishmentStage) => {
      const entries = groupedByStage[establishmentStage];
      const totalArea = entries.reduce((acc, entry) => acc + entry.attributes.area, 0);
      const establishmentStageData =
        groupedByStage[establishmentStage]?.[0]?.attributes?.mpaa_establishment_stage?.data
          ?.attributes;

      return {
        slug: establishmentStageData.slug,
        name: establishmentStageData.name,
        info: establishmentStageData.info,
        area: totalArea,
      };
    });
  }, [establishmentStagesData]);

  // Parse data to display in the chart
  const widgetChartData = useMemo(() => {
    if (!mergedEstablishmentStagesStats.length) return [];

    return mergedEstablishmentStagesStats.map((establishmentStage) => {
      return {
        title: establishmentStage.name,
        slug: establishmentStage.slug,
        ...(PATTERNS[establishmentStage.slug] && {
          background: `border-box #fff url(${PATTERNS[establishmentStage.slug]})`,
        }),
        totalArea: location.totalMarineArea,
        protectedArea: establishmentStage.area,
        info: establishmentStage.info,
      };
    });
  }, [location, mergedEstablishmentStagesStats]);

  const noData = !widgetChartData.length;
  const loading = isFetchingEstablishmentStagesData || isFetchingDataLastUpdate;

  return (
    <Widget
      title="Marine Conservation Establishment Stages"
      lastUpdated={dataLastUpdate}
      noData={noData}
      loading={loading}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart key={chartData.slug} className="py-2" data={chartData} areaToDisplay='protected-area' />
      ))}
    </Widget>
  );
};

export default EstablishmentStagesWidget;
