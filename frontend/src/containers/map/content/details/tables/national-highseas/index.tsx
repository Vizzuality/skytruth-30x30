import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useLocale } from 'next-intl';

import FiltersButton from '@/components/filters-button';
import TooltipButton from '@/components/tooltip-button';
import { applyFilters } from '@/containers/map/content/details/helpers';
import Table from '@/containers/map/content/details/table';
import useColumns from '@/containers/map/content/details/tables/national-highseas/useColumns';
import { FCWithMessages } from '@/types';
import { useGetLocations } from '@/types/generated/location';
import { useGetMpas } from '@/types/generated/mpa';
import { MpaListResponseDataItem } from '@/types/generated/strapi.schemas';

import SortingButton from '../../table/sorting-button';

const NationalHighseasTable: FCWithMessages = () => {
  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();
  const locale = useLocale();

  const locationsQuery = useGetLocations(
    {
      locale,
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

  const { data: mpasData }: { data: MpaListResponseDataItem[] } = useGetMpas(
    {
      locale,
      filters: {
        location: {
          code: {
            $eq: locationsQuery.data?.code,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        mpaa_establishment_stage: {
          fields: ['name', 'slug'],
        },
        mpa: {
          fields: ['name', 'wdpaid', 'area'],
          populate: {
            protection_status: {
              fields: ['slug', 'name'],
            },
          },
        },
        location: {
          fields: ['code', 'total_marine_area'],
        },
        mpaa_protection_level: {
          fields: ['slug', 'name'],
        },
        protection_status: {
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
    return mpasData?.map(({ attributes: mpa }) => {
      const protectionStatus = mpa?.protection_status?.data?.attributes;
      const establishmentStage = mpa?.mpaa_establishment_stage?.data?.attributes;
      const mpaaProtectionLevel = mpa?.mpaa_protection_level?.data?.attributes;

      const coveragePercentage = (mpa.area / locationsQuery.data?.totalMarineArea) * 100;

      return {
        protectedArea: mpa?.name,
        coverage: coveragePercentage,
        protectedAreaType: protectionStatus?.slug,
        establishmentStage: establishmentStage?.slug || 'N/A',
        protectionLevel: mpaaProtectionLevel?.slug || 'unknown',
        area: mpa?.area,
      };
    });
  }, [locationsQuery, mpasData]);

  const tableData = useMemo(() => {
    return applyFilters(parsedData, filters);
  }, [filters, parsedData]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Table columns={columns} data={tableData} />;
};

NationalHighseasTable.messages = [
  'containers.map',
  ...Table.messages,
  // Dependencies of `useColumns`
  ...SortingButton.messages,
  ...TooltipButton.messages,
  ...FiltersButton.messages,
];

export default NationalHighseasTable;
