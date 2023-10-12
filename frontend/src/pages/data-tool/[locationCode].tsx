import type { GetServerSideProps } from 'next';
import { useSetRecoilState } from 'recoil';

import Content from '@/containers/data-tool/content';
import Sidebar from '@/containers/data-tool/sidebar';
import Layout from '@/layouts/data-tool';
import Locations from '@/services/cms/locations';
import { locationAtom } from '@/store/location';
import type { Location } from '@/types/location';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode } = query;

  const { data: locationsData } = await Locations.getAll();
  const location = locationsData.find(({ attributes }) => attributes.code === locationCode);

  if (!location) return { notFound: true };

  return { props: { location: location?.attributes } };
};

export default function Page({ location }: { location: Location }) {
  const setLocation = useSetRecoilState(locationAtom);

  setLocation(location);

  return (
    <Layout title={location.name}>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <Content />
      <div className="h-1/2 flex-shrink-0 overflow-hidden bg-white p-6 pb-3 md:hidden">
        <Sidebar />
      </div>
    </Layout>
  );
}
