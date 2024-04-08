import { useGetDataInfos } from '@/types/generated/data-info';

const TOOLTIP_MAPPING = {
  marineConservation: 'coverage-widget',
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
