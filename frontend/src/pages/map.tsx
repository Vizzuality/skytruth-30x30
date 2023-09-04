import Head from 'next/head';

import Map from '@/components/map';
import FullscreenLayout from '@/layouts/fullscreen';

const MapPage: React.FC = () => (
  <FullscreenLayout>
    <Head>
      <title>Map</title>
    </Head>
    <Map />
  </FullscreenLayout>
);

export default MapPage;
