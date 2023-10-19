import { useState } from 'react';

import { MapProvider } from 'react-map-gl';

import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';

import 'styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

type PageProps = {
  dehydratedState: unknown;
};

const MyApp = ({ Component, pageProps }: AppProps<PageProps>) => {
  // Never ever instantiate the client outside a component, hook or callback as it can leak data
  // between users
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <MapProvider>
          <Component {...pageProps} />
        </MapProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
