import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';

import Content from '@/containers/data-tool/content';
import Sidebar from '@/containers/data-tool/sidebar';
import Layout from '@/layouts/data-tool';
import { getLocations } from '@/types/generated/location';
import { Location, LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode } = query;

  const queryClient = new QueryClient();

  const { data: locationsData } = await getLocations({
    filters: {
      code: locationCode,
    },
  });

  const location = locationsData?.[0];

  if (!location) return { notFound: true };

  queryClient.setQueryData<LocationGroupsDataItemAttributes>(
    ['locations', locationCode],
    location.attributes
  );

  return {
    props: {
      location: location.attributes,
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
