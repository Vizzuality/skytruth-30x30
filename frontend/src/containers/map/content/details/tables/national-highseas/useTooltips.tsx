import { useLocale } from 'next-intl';

import { useGetDataInfos } from '@/types/generated/data-info';

const TOOLTIP_MAPPING = {
  protectedArea: 'name-pa',
  coverage: 'coverage-wdpa',
  protectedAreaType: 'protected-area-type',
  establishmentStage: 'establishment-stage',
  protectionLevel: 'protection-level',
  fishingProtectionLevel: 'fishing-protection-level',
  area: 'protected-area-mpa',
  dataSource: 'details-data-source',
  iucnCategory: 'details-iucn-category',
};

const useTooltips = () => {
  const locale = useLocale();

  const { data: dataInfo } = useGetDataInfos(
    { locale },
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
