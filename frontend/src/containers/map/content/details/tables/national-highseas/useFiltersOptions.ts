import { useMemo } from 'react';

import { useLocale } from 'next-intl';

import { useGetDataSources } from '@/types/generated/data-source';
import { useGetMpaaEstablishmentStages } from '@/types/generated/mpaa-establishment-stage';
import { useGetMpaaProtectionLevels } from '@/types/generated/mpaa-protection-level';
import { useGetProtectionStatuses } from '@/types/generated/protection-status';
import { useGetMpaIucnCategories } from '@/types/generated/mpa-iucn-category';

const useFiltersOptions = () => {
  const locale = useLocale();

  // Fetch protection statuses and build options for the filter
  const { data: protectionStatuses } = useGetProtectionStatuses(
    { locale },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  const protectionStatusOptions = useMemo(() => {
    return protectionStatuses.map(({ attributes }) => ({
      name: attributes?.name,
      value: attributes?.slug,
    }));
  }, [protectionStatuses]);

  // Fetch establishment stages and build options for the filter
  const { data: establishmentStages } = useGetMpaaEstablishmentStages(
    { locale },
    {
      query: {
        select: ({ data }) => [...data, { attributes: { name: 'N/A', slug: 'N/A' } }],
        placeholderData: { data: [] },
      },
    }
  );

  const establishmentStageOptions = useMemo(() => {
    return establishmentStages.map(({ attributes }) => ({
      name: attributes?.name,
      value: attributes?.slug,
    }));
  }, [establishmentStages]);

  // Fetch data sources and build options for the filter
  const { data: dataSources } = useGetDataSources(
    { locale },
    {
      query: {
        select: ({ data }) =>
          data?.filter(({ attributes }) =>
            // ? Even though there are more data sources, we limit the display to these
            ['mpatlas', 'protected-planet']?.includes(attributes?.slug)
          ),
        placeholderData: { data: [] },
      },
    }
  );

  const dataSourceOptions = useMemo(() => {
    return dataSources.map(({ attributes }) => ({
      name: attributes?.title,
      value: attributes?.slug,
    }));
  }, [dataSources]);

  // Fetch IUCN category options and build options for the filter
  const { data: iucnCategories } = useGetMpaIucnCategories(
    { locale },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  const iucnCategoryOptions = useMemo(() => {
    return iucnCategories.map(({ attributes }) => ({
      name: attributes?.name,
      value: attributes?.slug,
    }));
  }, [iucnCategories]);

  // Fetch protection levels and build options for the filter
  const { data: protectionLevels } = useGetMpaaProtectionLevels(
    { locale },
    {
      query: {
        select: ({ data }) =>
          data.filter(
            ({ attributes }) =>
              // ? these protection values are used internally, but they should not be visible to the user
              !['fully-highly-protected', 'less-protected-unknown'].includes(attributes?.slug)
          ),
        placeholderData: { data: [] },
      },
    }
  );

  const protectionLevelOptions = useMemo(() => {
    return protectionLevels.map(({ attributes }) => ({
      name: attributes?.name,
      value: attributes?.slug,
    }));
  }, [protectionLevels]);

  return {
    protectionStatus: protectionStatusOptions,
    establishmentStage: establishmentStageOptions,
    dataSource: dataSourceOptions,
    iucnCategory: iucnCategoryOptions,
    protectionLevel: protectionLevelOptions,
  };
};

export default useFiltersOptions;
