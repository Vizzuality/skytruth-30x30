import { PropsWithChildren } from 'react';

import Head from '@/components/head';
import Header from '@/components/header';
import { FCWithMessages } from '@/types';

export interface FullscreenLayoutProps {
  title?: string;
  description?: string;
}

const FullscreenLayout: FCWithMessages<PropsWithChildren<FullscreenLayoutProps>> = ({
  children,
  title,
  description,
}) => (
  <>
    <Head title={title} description={description} />
    <div className="flex h-screen w-full flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="relative border-x border-b border-black md:h-full md:overflow-hidden">
        {children}
      </div>
    </div>
  </>
);

FullscreenLayout.messages = [...Header.messages];

export default FullscreenLayout;
