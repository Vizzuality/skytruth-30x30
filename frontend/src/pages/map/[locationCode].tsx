import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';

import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';
import Layout from '@/layouts/map';
import { getGetLocationsQueryKey, getGetLocationsQueryOptions } from '@/types/generated/location';
import { Location, LocationListResponse } from '@/types/generated/strapi.schemas';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode } = query;

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

export default function Page({ location }: { location: Location }) {
  return (
    <Layout title={location.name}>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <Content />
      <div className="h-1/2 flex-shrink-0 overflow-hidden bg-white md:hidden">
        <Sidebar />
      </div>
    </Layout>
  );
}
