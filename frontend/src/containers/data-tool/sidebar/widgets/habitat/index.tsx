import { useMemo } from 'react';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import Widget from '@/components/widget';
import { HABITAT_CHART_COLORS } from '@/constants/habitat-chart-colors';
import { useGetHabitatStats } from '@/types/generated/habitat-stat';
import type { Location } from '@/types/generated/strapi.schemas';

type HabitatWidgetProps = {
  location: Location;
};

const HabitatWidget: React.FC<HabitatWidgetProps> = ({ location }) => {
  const {
    data: { data: habitatStatsData, meta: habitatStatsMeta },
  } = useGetHabitatStats(
    {
      populate: '*',
      filters: {
        location: {
          code: location.code,
        },
      },
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data, meta }) => ({ data, meta }),
        placeholderData: { data: [], meta: undefined },
      },
    }
  );

  const widgetChartData = useMemo(() => {
    if (!habitatStatsData) return [];

    const parsedData = habitatStatsData.map((entry) => {
      const stats = entry?.attributes;
      const habitat = stats?.habitat?.data.attributes;

      return {
        title: habitat.name,
        slug: habitat.slug,
        barColor: HABITAT_CHART_COLORS[habitat.slug],
        totalArea: stats.totalArea,
        protectedArea: stats.protectedArea,
      };
    });

    return parsedData.reverse();
  }, [habitatStatsData]);

  // If there is no data for the widget, do not display it.
  if (!widgetChartData?.length) return null;

  return (
    <Widget
      title="Proportion of Habitat within Protected and Conserved Areas"
      lastUpdated={habitatStatsMeta?.updatedAt}
    >
      {widgetChartData.map((chartData) => (
        <HorizontalBarChart key={chartData.slug} className="py-2" data={chartData} />
      ))}
    </Widget>
  );
};

export default HabitatWidget;
