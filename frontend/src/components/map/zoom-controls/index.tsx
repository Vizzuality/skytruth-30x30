import { useMap } from 'react-map-gl';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { FCWithMessages } from '@/types';

const BUTTON_CLASSES = 'group bg-white';
const ICON_CLASSES = 'h-6 w-6 text-black group-hover:text-white';

const ZoomControls: FCWithMessages = () => {
  const t = useTranslations('components.map');

  const {
    current: { getZoom, zoomTo, getMinZoom, getMaxZoom },
  } = useMap();

  const zoom = getZoom();
  const minZoom = getMinZoom();
  const maxZoom = getMaxZoom();

  return (
    <div className="absolute top-0 right-0 z-10 flex flex-col border border-t-0 border-r-0 border-black">
      <Button
        type="button"
        size="icon"
        disabled={zoom === maxZoom}
        onClick={() => zoomTo(Math.round(Math.min(zoom + 1, maxZoom)), { duration: 250 })}
        className={BUTTON_CLASSES}
      >
        <Plus className={ICON_CLASSES} aria-hidden />
        <span className="sr-only">{t('zoom-in')}</span>
      </Button>
      <Button
        type="button"
        size="icon"
        onClick={() => zoomTo(Math.round(Math.max(zoom - 1, minZoom)), { duration: 250 })}
        disabled={zoom === minZoom}
        className={BUTTON_CLASSES}
      >
        <Minus className={ICON_CLASSES} aria-hidden />
        <span className="sr-only">{t('zoom-out')}</span>
      </Button>
    </div>
  );
};

ZoomControls.messages = ['components.map'];

export default ZoomControls;
