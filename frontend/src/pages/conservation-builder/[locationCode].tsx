import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';

import MapLayout from '@/layouts/map';
import { getGetLocationsQueryKey, getGetLocationsQueryOptions } from '@/types/generated/location';
import { LocationListResponse } from '@/types/generated/strapi.schemas';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode = 'GLOB' } = query;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...getGetLocationsQueryOptions({
      filters: {
        code: locationCode,
      },
    }),
  });

  const locationsData = queryClient.getQueryData<LocationListResponse>(
    getGetLocationsQueryKey({
      filters: {
        code: locationCode,
      },
    })
  );

  if (!locationsData || !locationsData.data) return { notFound: true };

  return {
    props: {
      location: locationsData.data[0].attributes || {
        code: 'GLOB',
        name: 'Global',
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function ConservationBuilderPage() {
  return null;
}

ConservationBuilderPage.layout = {
  Component: MapLayout,
  props: {
    title: 'Conservation builder',
    type: 'conservation-builder',
  },
};
