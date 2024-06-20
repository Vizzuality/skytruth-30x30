import { PropsWithChildren, useEffect } from 'react';

import { useResetAtom } from 'jotai/utils';
import { useTranslations } from 'next-intl';

import Head from '@/components/head';
import Header from '@/components/header';
import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';
import { drawStateAtom, modellingAtom } from '@/containers/map/store';
import { FCWithMessages } from '@/types';

const LAYOUT_TYPES = {
  progress_tracker: 'progress-tracker',
  conservation_builder: 'conservation-builder',
};

export interface MapLayoutProps {
  title?: string;
  description?: string;
  type: keyof typeof LAYOUT_TYPES;
}

const MapLayout: FCWithMessages<PropsWithChildren<MapLayoutProps>> = ({
  title,
  description,
  type,
}) => {
  const t = useTranslations('layouts.map');

  const resetModelling = useResetAtom(modellingAtom);
  const resetDrawState = useResetAtom(drawStateAtom);

  useEffect(() => {
    if (type !== LAYOUT_TYPES.conservation_builder) {
      resetModelling();
      resetDrawState();
    }
  }, [resetDrawState, resetModelling, type]);

  return (
    <>
      <Head
        title={!title.length && type === 'conservation_builder' ? t('conservation-builder') : title}
        description={description}
      />
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
};

MapLayout.messages = ['layouts.map', ...Header.messages, ...Sidebar.messages, ...Content.messages];

export default MapLayout;
