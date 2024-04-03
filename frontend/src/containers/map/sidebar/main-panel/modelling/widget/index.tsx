import { PropsWithChildren, useMemo } from 'react';

import { useAtomValue } from 'jotai';

import useTooltips from '../useTooltips';

import HorizontalBarChart from '@/components/charts/horizontal-bar-chart';
import TooltipButton from '@/components/tooltip-button';
import Widget from '@/components/widget';
import { modellingAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';

const DEFAULT_ENTRY_CLASSNAMES = 'border-t border-black py-6';

const DEFAULT_CHART_DATA = {
  background: '#000',
};

const DEFAULT_CHART_PROPS = {
  className: 'py-2',
  showLegend: false,
  showTarget: false,
};

type WidgetSectionWidgetTitleProps = PropsWithChildren<{
  title: string;
  tooltip?: string;
}>;

const WidgetSectionWidgetTitle: React.FC<WidgetSectionWidgetTitleProps> = ({ title, tooltip }) => {
  return (
    <div className="flex items-center">
      <span className="font-mono text-xs uppercase">{title}</span>
      {tooltip && <TooltipButton className="-mt-1" text={tooltip} />}
    </div>
  );
};

const ModellingWidget: React.FC = () => {
  const chartsProps = DEFAULT_CHART_PROPS;

  const {
    status: modellingStatus,
    data: modellingData,
    messageError,
  } = useAtomValue(modellingAtom);

  // Tooltips with mapping
  const tooltips = useTooltips();

  // Get all locations in order to get country names for modelling data
  const { data: locationsData } = useGetLocations(
    {
      'pagination[limit]': -1,
      sort: 'name:asc',
    },
    {
      query: {
        placeholderData: { data: [] },
        select: ({ data }) => data,
      },
    }
  );

  // Build contribution details details for the charts
  const contributionDetailsData = useMemo(() => {
    if (!locationsData.length || !modellingData) return null;

    const modellingLocations = modellingData?.locations_area;

    const chartData = modellingLocations.map((modellingLocation) => {
      const location = locationsData?.find(
        ({ attributes }) => modellingLocation.code === attributes?.code
      )?.attributes;

      if (!location) return null;

      const { name, totalMarineArea } = location;

      return {
        ...DEFAULT_CHART_DATA,
        title: name,
        protectedArea: modellingLocation.protected_area,
        totalArea: totalMarineArea,
      };
    });

    return chartData;
  }, [modellingData, locationsData]);

  // Build global contribution details for the charts
  const globalContributionData = useMemo(() => {
    const location = locationsData?.find(
      ({ attributes }) => attributes?.code === 'GLOB'
    )?.attributes;

    if (!location) return null;

    return {
      ...DEFAULT_CHART_DATA,
      protectedArea: modellingData?.total_protected_area,
      totalArea: location?.totalMarineArea,
    };
  }, [modellingData, locationsData]);

  const administrativeBoundaries = contributionDetailsData?.map(({ title }) => title);

  const loading = modellingStatus === 'running';
  const error = modellingStatus === 'error';

  return (
    <Widget
      className="border-b border-black py-0"
      noData={!contributionDetailsData}
      loading={loading}
      error={error}
      messageError={messageError}
    >
      <div className="flex flex-col">
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES, 'flex justify-between border-t-0')}>
          <WidgetSectionWidgetTitle
            title="Administrative boundary"
            tooltip={tooltips?.['administrativeBoundary']}
          />
          <span className="text-right font-mono text-xs font-bold underline">
            {administrativeBoundaries?.[0]}{' '}
            {administrativeBoundaries?.length > 1 && `+${administrativeBoundaries?.length - 1}`}
          </span>
        </div>
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES)}>
          <WidgetSectionWidgetTitle
            title="Contribution details"
            tooltip={tooltips?.['contributionDetails']}
          />
          {contributionDetailsData?.map((entry) => (
            <HorizontalBarChart key={entry.title} data={entry} {...chartsProps} />
          ))}
        </div>
        <div className={cn(DEFAULT_ENTRY_CLASSNAMES)}>
          <WidgetSectionWidgetTitle
            title="Global contribution"
            tooltip={tooltips?.['globalContribution']}
          />
          <HorizontalBarChart data={globalContributionData} {...chartsProps} />
        </div>
      </div>
    </Widget>
  );
};

export default ModellingWidget;
