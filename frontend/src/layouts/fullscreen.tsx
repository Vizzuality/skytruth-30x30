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
    <div className="flex h-screen w-full flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="h-full border-x border-b border-black">{children}</div>
    </div>
  </>
);

export default FullscreenLayout;
