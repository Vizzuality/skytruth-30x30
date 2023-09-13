import { FC } from 'react';

import { Minus, Plus } from 'lucide-react';
import { useMap } from 'react-map-gl/maplibre';

import { Button } from '@/components/ui/button';

const ZoomControls: FC = () => {
  const {
    current: { getZoom, zoomTo, getMinZoom, getMaxZoom },
  } = useMap();

  const zoom = getZoom();
  const minZoom = getMinZoom();
  const maxZoom = getMaxZoom();

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col">
      <Button
        type="button"
        size="icon"
        disabled={zoom === maxZoom}
        onClick={() => zoomTo(Math.round(Math.min(zoom + 1, maxZoom)), { duration: 250 })}
      >
        <Plus className="h-6 w-6" aria-hidden />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        type="button"
        size="icon"
        onClick={() => zoomTo(Math.round(Math.max(zoom - 1, minZoom)), { duration: 250 })}
        disabled={zoom === minZoom}
      >
        <Minus className="h-6 w-6" aria-hidden />
        <span className="sr-only">Zoom out</span>
      </Button>
    </div>
  );
};

export default ZoomControls;
