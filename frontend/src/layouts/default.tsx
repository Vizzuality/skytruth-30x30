import { PropsWithChildren } from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';

export const DefaultLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <div className="mx-auto my-8 max-w-7xl px-6 lg:px-8">{children}</div>
    <Footer />
  </>
);
