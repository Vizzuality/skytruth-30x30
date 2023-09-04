import Head from 'next/head';

import DefaultLayout from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout>
    <Head>
      <title>Privacy Policy</title>
    </Head>
    <p>Hello world!</p>
  </DefaultLayout>
);

export default Home;
