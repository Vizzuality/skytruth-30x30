import { PropsWithChildren } from 'react';

import Head from 'next/head';

import Footer from '@/components/footer';
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
    <Head>
      <title>{`${title ? `${title} | ` : ''}Skytruth 30x30`}</title>
      {description && <meta name="description" content={description} />}
    </Head>
    <Header />
    <div className="mx-auto my-8 max-w-7xl px-6 lg:px-8">{children}</div>
    <Footer />
  </>
);

export default DefaultLayout;
