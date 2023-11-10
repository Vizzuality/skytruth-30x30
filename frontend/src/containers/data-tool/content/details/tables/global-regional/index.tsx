import { useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';

import Table from '@/containers/data-tool/content/details/table';
// import columns from '@/containers/data-tool/content/details/tables/global-regional/columns';
import useColumns from '@/containers/data-tool/content/details/tables/global-regional/useColumns';
import { locationAtom } from '@/store/location';
import { useGetLocations } from '@/types/generated/location';
import type { LocationListResponseDataItem } from '@/types/generated/strapi.schemas';

const DATA_YEAR = 2023;

const GlobalRegionalTable: React.FC = () => {
  const location = useAtomValue(locationAtom);

  const [filters, setFilters] = useState({
    locationType: ['country', 'worldwide', 'highseas', 'region'],
  });

  const handleOnFiltersChange = (field, values) => {
    setFilters({ ...filters, [field]: values });
  };

  const columns = useColumns({ filters, onFiltersChange: handleOnFiltersChange });
  // console.log(columns);

  // Get worldwide data in order to calculate contributions per location
  const { data: globalData }: { data: LocationListResponseDataItem[] } = useGetLocations(
    {
      filters: {
        type: {
          $eq: ['worldwide'],
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: ['code', 'name', 'type', 'totalMarineArea'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        protection_coverage_stats: {
          fields: ['cumSumProtectedArea', 'protectedAreasCount', 'year'],
          filters: {
            year: {
              $eq: DATA_YEAR,
            },
          },
        },
      },
    },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  // Get location data and calculate data to display on the table
  const { data: locationsData }: { data: LocationListResponseDataItem[] } = useGetLocations(
    {
      filters:
        location?.type === 'region'
          ? {
              groups: {
                code: {
                  $eq: location.code,
                },
              },
            }
          : {
              type: {
                $eq: ['country', 'highseas'],
              },
            },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: ['code', 'name', 'type', 'totalMarineArea'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        protection_coverage_stats: {
          fields: ['cumSumProtectedArea', 'protectedAreasCount', 'year'],
          populate: {
            protection_status: {
              fields: ['slug', 'name'],
            },
          },
          filters: {
            year: {
              $eq: DATA_YEAR,
            },
          },
        },
        mpaa_protection_level_stats: {
          fields: ['area'],
          populate: {
            mpaa_protection_level: {
              fields: ['slug', 'name'],
            },
          },
        },
        fishing_protection_level_stats: {
          fields: ['area'],
          populate: {
            fishing_protection_level: {
              fields: ['slug', 'name'],
            },
          },
        },
      },
    },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  // Calculate global stats
  const globalStats = useMemo(() => {
    const coverageStats = globalData[0]?.attributes?.protection_coverage_stats?.data || [];

    const protectedArea = coverageStats.reduce(
      (acc, { attributes }) => acc + attributes?.cumSumProtectedArea,
      0
    );

    return { protectedArea };
  }, [globalData]);

  // Calculate table data
  const parsedData = useMemo(() => {
    return locationsData.map(({ attributes: location }) => {
      // Base stats needed for calculations
      const coverageStats = location?.protection_coverage_stats?.data;
      const mpaaStats = location?.mpaa_protection_level_stats?.data;
      const lfpStats = location?.fishing_protection_level_stats?.data;

      // Coverage calculations
      const protectedArea = coverageStats.reduce(
        (acc, { attributes }) => acc + attributes?.cumSumProtectedArea,
        0
      );
      const coveragePercentage = (protectedArea * 100) / location.totalMarineArea;

      // MPAs calculations
      const numMPAs =
        coverageStats.filter(
          ({ attributes }) => attributes?.protection_status?.data?.attributes?.slug === 'mpa'
        )?.length || 0;

      // OECMs calculations
      const numOEMCs =
        coverageStats.filter(
          ({ attributes }) => attributes?.protection_status?.data?.attributes?.slug === 'oecm'
        )?.length || 0;

      // Fully/Highly Protected calculations
      const fullyHighProtected = mpaaStats.filter(
        ({ attributes }) =>
          attributes?.mpaa_protection_level?.data?.attributes?.slug === 'fully-highly-protected'
      );
      const fullyHighProtectedArea = fullyHighProtected.reduce(
        (acc, { attributes }) => acc + attributes?.area,
        0
      );
      const fullyHighProtectedAreaPercentage =
        (fullyHighProtectedArea * 100) / globalStats.protectedArea;

      // Highly Protected LFP calculations
      const lfpHighProtected = lfpStats.filter(
        ({ attributes }) =>
          attributes?.fishing_protection_level?.data?.attributes?.slug === 'highly'
      );
      const lfpHighProtectedArea = lfpHighProtected.reduce(
        (acc, { attributes }) => acc + attributes?.area,
        0
      );
      const lfpHighProtectedPercentage = (lfpHighProtectedArea * 100) / globalStats.protectedArea;

      // Global contributions calculations
      const globalContributionPercentage = (protectedArea * 100) / globalStats.protectedArea;

      return {
        location: location.name,
        coverage: coveragePercentage,
        area: location.totalMarineArea,
        locationType: location.type,
        mpas: numMPAs,
        oecms: numOEMCs,
        fullyHighProtected: fullyHighProtectedAreaPercentage,
        highlyProtectedLFP: lfpHighProtectedPercentage,
        globalContribution: globalContributionPercentage,
      };
    });
  }, [globalStats, locationsData]);

  const tableData = useMemo(() => {
    const filteredData = parsedData.filter((item) => {
      for (const key in filters) {
        return filters[key].includes(item[key]);
      }
      return true;
    });
    return filteredData;
  }, [filters, parsedData]);

  return <Table columns={columns} data={tableData} />;
};

export default GlobalRegionalTable;
