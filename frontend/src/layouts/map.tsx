import { PropsWithChildren } from 'react';

import Head from 'next/head';

import Header from '@/components/header';

export interface FullscreenLayoutProps {
  title?: string;
  description?: string;
}

const FullscreenLayout: React.FC<PropsWithChildren<FullscreenLayoutProps>> = ({
  children,
  title,
  description,
}) => (
  <>
    <Head>
      <title>{`${title ? `${title} | ` : ''}SkyTruth 30x30`}</title>
      {description && <meta name="description" content={description} />}
    </Head>
    <div className="flex h-screen w-screen flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
        {children}
      </div>
    </div>
  </>
);

export default FullscreenLayout;
