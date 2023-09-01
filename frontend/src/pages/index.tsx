import Head from 'next/head';

import { DefaultLayout } from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout>
    <Head>
      <title>Hello world!</title>
    </Head>
    <p>Beep, beep</p>
  </DefaultLayout>
);

export default Home;
