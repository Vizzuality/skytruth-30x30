import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';

import { applyFilters } from '@/containers/data-tool/content/details/helpers';
import Table from '@/containers/data-tool/content/details/table';
import useColumns from '@/containers/data-tool/content/details/tables/national-highseas/useColumns';
import { useGetMpaProtectionCoverageStats } from '@/types/generated/mpa-protection-coverage-stat';
import {
  LocationGroupsDataItemAttributes,
  MpaProtectionCoverageStatListResponseDataItem,
} from '@/types/generated/strapi.schemas';

const NationalHighseasTable: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();

  const queryClient = useQueryClient();

  const dataToolLocation = queryClient.getQueryData<LocationGroupsDataItemAttributes>([
    'locations',
    locationCode,
  ]);

  const [filters, setFilters] = useState({
    // ! This shouldn't be hardcoded. The setup needs to be able to work the same without any default filters here.
    protectedAreaType: ['mpa', 'oecm'],
    establishmentStage: [
      'actively-managed',
      'designated',
      'designated-unimplemented',
      'implemented',
      'proposed-committed',
      'unknown',
    ],
  });

  const handleOnFiltersChange = (field, values) => {
    setFilters({ ...filters, [field]: values });
  };

  const columns = useColumns({ filters, onFiltersChange: handleOnFiltersChange });

  const { data: coverageData }: { data: MpaProtectionCoverageStatListResponseDataItem[] } =
    useGetMpaProtectionCoverageStats(
      {
        filters: {
          location: {
            code: {
              $eq: dataToolLocation?.code,
            },
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fields: ['area'],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        populate: {
          mpa: {
            fields: ['name', 'wdpaid', 'area'],
            populate: {
              mpaa_establishment_stage: {
                fields: ['slug', 'name'],
              },
              protection_status: {
                fields: ['slug', 'name'],
              },
            },
          },
          location: {
            fields: ['code', 'total_marine_area'],
          },
          fishing_protection_level: {
            fields: ['slug', 'name'],
          },
          mpaa_protection_level: {
            fields: ['slug', 'name'],
          },
        },
        'pagination[limit]': -1,
      },
      {
        query: {
          select: ({ data }) => data,
          placeholderData: { data: [] },
        },
      }
    );

  const parsedData = useMemo(() => {
    return coverageData.map(({ attributes: coverageStats }) => {
      const mpa = coverageStats?.mpa?.data?.attributes;
      const protectionStatus = mpa?.protection_status?.data?.attributes;
      const establishmentStage = mpa?.mpaa_establishment_stage?.data?.attributes;
      const mpaaProtectionLevel = coverageStats?.mpaa_protection_level?.data?.attributes;
      const fishingProtectionLevel = coverageStats?.fishing_protection_level?.data?.attributes;

      // Calculate coverage percentage
      const coveragePercentage = (coverageStats.area / mpa?.area) * 100;

      return {
        protectedArea: mpa?.name,
        coverage: coveragePercentage,
        protectedAreaType: protectionStatus?.slug,
        establishmentStage: establishmentStage?.slug,
        protectionLevel: mpaaProtectionLevel?.slug,
        fishingProtectionLevel: fishingProtectionLevel?.slug,
        area: mpa?.area,
      };
    });
  }, [coverageData]);

  const tableData = useMemo(() => {
    return applyFilters(parsedData, filters);
  }, [filters, parsedData]);

  return <Table columns={columns} data={tableData} />;
};

export default NationalHighseasTable;
