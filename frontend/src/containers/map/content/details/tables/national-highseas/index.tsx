import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { applyFilters } from '@/containers/map/content/details/helpers';
import Table from '@/containers/map/content/details/table';
import useColumns from '@/containers/map/content/details/tables/national-highseas/useColumns';
import { useGetLocations } from '@/types/generated/location';
import { useGetMpaProtectionCoverageStats } from '@/types/generated/mpa-protection-coverage-stat';
import { MpaProtectionCoverageStatListResponseDataItem } from '@/types/generated/strapi.schemas';

const NationalHighseasTable: React.FC = () => {
  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        queryKey: ['locations', locationCode],
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

  const [filters, setFilters] = useState({
    protectedAreaType: [],
    establishmentStage: [],
    protectionLevel: [],
    fishingProtectionLevel: [],
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
              $eq: locationsQuery.data?.code,
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
      const coveragePercentage = (coverageStats.area / locationsQuery.data?.totalMarineArea) * 100;

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
  }, [coverageData, locationsQuery.data]);

  const tableData = useMemo(() => {
    return applyFilters(parsedData, filters);
  }, [filters, parsedData]);

  return <Table columns={columns} data={tableData} />;
};

export default NationalHighseasTable;
