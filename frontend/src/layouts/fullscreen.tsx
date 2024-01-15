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
    <div className="flex h-screen w-full flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="h-full border-x border-b border-black">{children}</div>
    </div>
  </>
);

export default FullscreenLayout;
