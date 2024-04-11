import { useMemo } from 'react';

import { useGetFishingProtectionLevels } from '@/types/generated/fishing-protection-level';
import { useGetMpaaEstablishmentStages } from '@/types/generated/mpaa-establishment-stage';
import { useGetMpaaProtectionLevels } from '@/types/generated/mpaa-protection-level';
import { useGetProtectionStatuses } from '@/types/generated/protection-status';

const useFiltersOptions = () => {
  // Fetch protection statuses and build options for the filter
  const { data: protectionStatuses } = useGetProtectionStatuses(
    {},
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
    {},
    {
      query: {
        select: ({ data }) => data,
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

  // Fetch protection levels and build options for the filter
  const { data: protectionLevels } = useGetMpaaProtectionLevels(
    {},
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

  // Fetch fishing protection levels and build options for the filter
  const { data: fishingProtectionLevels } = useGetFishingProtectionLevels(
    {},
    {
      query: {
        select: ({ data }) => data,
      },
    }
  );

  const fishingProtectionLevelOptions = useMemo(() => {
    return fishingProtectionLevels?.map(({ attributes }) => ({
      name: attributes?.name,
      value: attributes?.slug,
    }));
  }, [fishingProtectionLevels]);

  return {
    protectionStatus: protectionStatusOptions,
    establishmentStage: establishmentStageOptions,
    protectionLevel: protectionLevelOptions,
    fishingProtectionLevel: fishingProtectionLevelOptions,
  };
};

export default useFiltersOptions;
