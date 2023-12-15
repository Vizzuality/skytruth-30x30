import { useGetDataInfos } from '@/types/generated/data-info';

const TOOLTIP_MAPPING = {
  administrativeBoundary: 'administrative-boundary',
  contributionDetails: 'contribution-details',
  globalContribution: 'global-contribution',
};

const useTooltips = () => {
  const { data: dataInfo } = useGetDataInfos(
    {},
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  const tooltips = {};

  Object.entries(TOOLTIP_MAPPING).map(([key, value]) => {
    const tooltip = dataInfo.find(({ attributes }) => attributes.slug === value)?.attributes
      ?.content;

    if (!tooltip) return;
    tooltips[key] = tooltip;
  });

  return tooltips;
};

export default useTooltips;
