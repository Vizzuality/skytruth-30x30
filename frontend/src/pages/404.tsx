import Head from 'next/head';

import { DefaultLayout } from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout>
    <Head>
      <title>Page Not Found</title>
    </Head>
    <p>404</p>
  </DefaultLayout>
);

export default Home;
