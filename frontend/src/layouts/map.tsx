import { PropsWithChildren } from 'react';

import Head from '@/components/head';
import Header from '@/components/header';
import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';

export interface MapLayoutProps {
  title?: string;
  description?: string;
  type: 'progress-tracker' | 'conservation-builder';
}

const MapLayout: React.FC<PropsWithChildren<MapLayoutProps>> = ({ title, description, type }) => (
  <>
    <Head title={title} description={description} />
    <div className="flex h-screen w-screen flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block">
          <Sidebar type={type} />
        </div>
        {/* CONTENT: MAP/TABLES */}
        <Content />
        {/* MOBILE SIDEBAR */}
        <div className="h-1/2 flex-shrink-0 overflow-hidden bg-white md:hidden">
          <Sidebar type={type} />
        </div>
      </div>
    </div>
  </>
);

export default MapLayout;
