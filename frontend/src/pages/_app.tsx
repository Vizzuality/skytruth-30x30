import { useState } from 'react';

import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import 'styles/globals.css';

type PageProps = {
  dehydratedState: unknown;
};

const MyApp = ({ Component, pageProps }: AppProps<PageProps>) => {
  // const router = useRouter();

  // Never ever instantiate the client outside a component, hook or callback as it can leak data
  // between users
  const [queryClient] = useState(() => new QueryClient());

  // const handleRouteChangeCompleted = useCallback(() => {
  //   // Analytics go here
  // }, []);

  // useEffect(() => {
  //   router.events.on('routeChangeComplete', handleRouteChangeCompleted);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChangeCompleted);
  //   };
  // }, [router.events, handleRouteChangeCompleted]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
