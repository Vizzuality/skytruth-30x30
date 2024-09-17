import { useRouter } from 'next/router';

import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { modellingAtom } from '@/containers/map/store';
import { FCWithMessages } from '@/types';

import LocationSelector from '../../location-selector';

import ModellingButtons from './modelling-buttons';
import ModellingIntro from './modelling-intro';
import ModellingWidget from './widget';

const SidebarModelling: FCWithMessages = () => {
  const t = useTranslations('containers.map-sidebar-main-panel');

  const { push } = useRouter();
  const searchParams = useMapSearchParams();
  const { status: modellingStatus } = useAtomValue(modellingAtom);

  const showIntro = modellingStatus === 'idle';

  const handleLocationSelected = (locationCode) => {
    push(`${PAGES.conservationBuilder}/${locationCode}?${searchParams.toString()}`);
  };

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-12">
        <div className="sticky border-b border-black bg-blue px-4 py-4 md:py-6 md:px-8">
          {showIntro && <h1 className="text-5xl font-black">{t('conservation-scenarios')}</h1>}
          {!showIntro && (
            <div className="space-y-2 text-xl font-black">
              <h1 className="text-5xl font-black">{t('custom-area')}</h1>
              <p>{t('custom-area-description')}</p>
            </div>
          )}

          <LocationSelector className="mt-2" theme="blue" onChange={handleLocationSelected} />
          <ModellingButtons className="mt-4" />
        </div>
        {showIntro && <ModellingIntro />}
        {!showIntro && <ModellingWidget />}
      </div>
    </>
  );
};

SidebarModelling.messages = [
  'containers.map-sidebar-main-panel',
  ...LocationSelector.messages,
  ...ModellingButtons.messages,
  ...ModellingIntro.messages,
  ...ModellingWidget.messages,
];

export default SidebarModelling;
