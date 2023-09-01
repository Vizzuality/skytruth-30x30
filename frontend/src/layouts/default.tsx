import { PropsWithChildren } from 'react';

import Header from '@/components/header';

export const DefaultLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <div className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">{children}</div>
  </>
);
