import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';

import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';
import Layout from '@/layouts/map';
import { getLocations } from '@/types/generated/location';
import { Location, LocationListResponseDataItem } from '@/types/generated/strapi.schemas';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode } = query;

  const queryClient = new QueryClient();

  const { data: locationsData } = await getLocations({
    filters: {
      code: locationCode,
    },
  });

  if (!locationsData) return { notFound: true };

  queryClient.setQueryData<{ data: LocationListResponseDataItem[] }>(['locations', locationCode], {
    data: locationsData,
  });

  return {
    props: {
      location: locationsData[0].attributes,
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
