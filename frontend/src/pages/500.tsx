import Head from 'next/head';

import { DefaultLayout } from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout>
    <Head>
      <title>Error</title>
    </Head>
    <p>500</p>
  </DefaultLayout>
);

export default Home;
