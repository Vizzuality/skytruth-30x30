import { useMemo } from 'react';

import { useRouter } from 'next/router';

import Table from '@/containers/map/content/details/table';
import useColumns from '@/containers/map/content/details/tables/global-regional/useColumns';
import { useGetLocations } from '@/types/generated/location';
import type { LocationListResponseDataItem } from '@/types/generated/strapi.schemas';

const GlobalRegionalTable: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();

  const globalLocationQuery = useGetLocations(
    {
      filters: {
        code: 'GLOB',
      },
    },
    {
      query: {
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

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

  const columns = useColumns();

  // Get location data and calculate data to display on the table
  const { data: locationsData }: { data: LocationListResponseDataItem[] } = useGetLocations(
    {
      filters:
        locationsQuery.data?.type === 'region'
          ? {
              groups: {
                code: {
                  $eq: locationsQuery.data?.code,
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
      // populate: '*',
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  // Calculate table data
  const parsedData = useMemo(() => {
    return locationsData.map(({ attributes: location }) => {
      // Base stats needed for calculations
      const allCoverageStats = location.protection_coverage_stats?.data;
      const mpaaStats = location.mpaa_protection_level_stats?.data;
      const lfpStats = location.fishing_protection_level_stats?.data;

      // Find coverage stats data for the last available year in the data
      const lastCoverageDataYear = Math.max(
        ...allCoverageStats.map(({ attributes }) => attributes.year)
      );
      const coverageStats = allCoverageStats.filter(
        ({ attributes }) => attributes.year === lastCoverageDataYear
      );

      // Coverage calculations (MPA + OECM)
      const protectedArea = coverageStats.reduce(
        (acc, { attributes }) => acc + attributes?.cumSumProtectedArea,
        0
      );
      const coveragePercentage = (protectedArea * 100) / location.totalMarineArea;

      // MPAs calculations
      const numMPAs =
        coverageStats.find(
          ({ attributes }) => attributes?.protection_status?.data?.attributes?.slug === 'mpa'
        )?.attributes?.protectedAreasCount || 0;

      // OECMs calculations
      const numOECMs =
        coverageStats.find(
          ({ attributes }) => attributes?.protection_status?.data?.attributes?.slug === 'oecm'
        )?.attributes?.protectedAreasCount || 0;

      const percentageMPAs = (numMPAs * 100) / (numMPAs + numOECMs);
      const percentageOECMs = (numOECMs * 100) / (numMPAs + numOECMs);

      // Fully/Highly Protected calculations
      const fullyHighlyProtected = mpaaStats.filter(
        ({ attributes }) =>
          attributes?.mpaa_protection_level?.data?.attributes?.slug === 'fully-highly-protected'
      );
      const fullyHighlyProtectedArea = fullyHighlyProtected.reduce(
        (acc, { attributes }) => acc + attributes?.area,
        0
      );
      const fullyHighlyProtectedAreaPercentage =
        (fullyHighlyProtectedArea * 100) / location.totalMarineArea;

      // Highly Protected LFP calculations
      const lfpHighProtected = lfpStats.filter(
        ({ attributes }) =>
          attributes?.fishing_protection_level?.data?.attributes?.slug === 'highly'
      );
      const lfpHighProtectedArea = lfpHighProtected.reduce(
        (acc, { attributes }) => acc + attributes?.area,
        0
      );
      const lfpHighProtectedPercentage = (lfpHighProtectedArea * 100) / location.totalMarineArea;

      // Global contributions calculations
      const globalContributionPercentage =
        (protectedArea * 100) / globalLocationQuery?.data?.totalMarineArea;

      return {
        location: location.name,
        locationCode: location.code,
        totalMarineArea: location.totalMarineArea,
        coverage: coveragePercentage,
        area: protectedArea,
        locationType: location.type,
        mpas: percentageMPAs,
        oecms: percentageOECMs,
        fullyHighlyProtected: fullyHighlyProtectedAreaPercentage,
        highlyProtectedLfp: lfpHighProtectedPercentage,
        globalContribution: globalContributionPercentage,
      };
    });
  }, [globalLocationQuery?.data, locationsData]);

  const tableData = parsedData;

  return <Table columns={columns} data={tableData} />;
};

export default GlobalRegionalTable;
