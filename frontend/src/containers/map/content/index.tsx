import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import CloseIcon from '@/styles/icons/close.svg';
import { FCWithMessages } from '@/types';

import Details from './details';
import Map from './map';

const MapContent: FCWithMessages = () => {
  const t = useTranslations('containers.map');
  const [{ showDetails, tab }, setSettings] = useSyncMapContentSettings();

  const handleOnCloseClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: false }));
  };

  return (
    <>
      <Map />
      {showDetails && (
        <div className="relative h-full w-full border-b border-r border-black">
          {tab === 'marine' && <Details />}
          {/* TODO: The following element is a placeholder */}
          {tab !== 'marine' && (
            <div className="absolute h-full w-full overflow-scroll bg-white px-4 py-4 md:px-6">
              <div className="sticky left-0 mb-8 flex gap-8 md:justify-end">
                <Button
                  variant="text-link"
                  className="m-0 cursor-pointer p-0 font-mono text-xs normal-case no-underline"
                  onClick={handleOnCloseClick}
                >
                  {t('close')}
                  <Icon icon={CloseIcon} className="ml-2 h-3 w-3 pb-px " />
                </Button>
              </div>
              <div className="py-36 text-center font-black">{t('coming-soon')}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

MapContent.messages = [...Map.messages, ...Details.messages];

export default MapContent;
