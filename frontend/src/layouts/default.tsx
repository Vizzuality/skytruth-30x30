import { PropsWithChildren } from 'react';

import Footer from '@/components/footer';
import Head from '@/components/head';
import Header from '@/components/header';

export interface DefaultLayoutProps {
  title?: string;
  description?: string;
}

const DefaultLayout: React.FC<PropsWithChildren<DefaultLayoutProps>> = ({
  children,
  title,
  description,
}) => (
  <>
    <Head title={title} description={description} />
    <Header />
    <div className="mx-auto my-8 max-w-7xl px-6 lg:px-10">{children}</div>
    <Footer />
  </>
);

export default DefaultLayout;
