import { PropsWithChildren } from 'react';

import Head from '@/components/head';
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
    <Head title={title} description={description} />
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
