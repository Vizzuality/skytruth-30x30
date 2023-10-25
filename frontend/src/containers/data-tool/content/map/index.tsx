import { ComponentProps, useCallback, useState } from 'react';

import { useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';

import { useAtomValue, useSetAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';

import Map, {
  ZoomControls,
  LayersDropdown,
  Legend,
  Attributions,
  DrawControls,
  Drawing,
} from '@/components/map';
import SidebarContent from '@/components/sidebar-content';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import Popup from '@/containers/map/popup';
import { useSyncMapSettings } from '@/containers/data-tool/content/map/sync-settings';
import { cn } from '@/lib/classnames';
import {
  drawStateAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
} from '@/store/map';
import { useGetLayers } from '@/types/generated/layer';
import { LayerTyped } from '@/types/layers';

const LayerManager = dynamic(() => import('@/containers/data-tool/content/map/layer-manager'), {
  ssr: false,
});

const MapPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [{ bbox }, setMapSettings] = useSyncMapSettings();
  const { default: map } = useMap();
  const drawState = useAtomValue(drawStateAtom);
  const setPopup = useSetAtom(popupAtom);

  const layersInteractive = useAtomValue(layersInteractiveAtom);
  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const { data: layersInteractiveData } = useGetLayers(
    {
      filters: {
        id: {
          $in: layersInteractive,
        },
      },
    },
    {
      query: {
        enabled: !!layersInteractive.length,
        select: ({ data }) => data,
      },
    }
  );

  const handleMoveEnd = useCallback(() => {
    setMapSettings((prev) => ({
      ...prev,
      bbox: map
        .getBounds()
        .toArray()
        .flat()
        .map((b) => parseFloat(b.toFixed(2))) as typeof bbox,
    }));
  }, [map, setMapSettings]);

  const handleMapClick = useCallback(
    (e: Parameters<ComponentProps<typeof Map>['onClick']>[0]) => {
      if (
        layersInteractive.length &&
        layersInteractiveData.some((l) => {
          const attributes = l.attributes as LayerTyped;
          return attributes?.interaction_config?.events.some((ev) => ev.type === 'click');
        })
      ) {
        const p = Object.assign({}, e, { features: e.features ?? [] });

        setPopup(p);
      }
    },
    [layersInteractive, layersInteractiveData, setPopup]
  );

  return (
    <div className="relative flex h-full w-full flex-col md:flex-row">
      {/* <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="hidden md:block">
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            size="icon"
            className={cn('absolute bottom-3 z-10', {
              'left-0': !sidebarOpen,
              'left-[430px] transition-[left] delay-500': sidebarOpen,
            })}
          >
            <ChevronLeft className={cn('h-6 w-6', { 'rotate-180': !sidebarOpen })} aria-hidden />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="relative top-0 left-0 z-20 h-full w-[430px] flex-shrink-0 bg-white p-8 pb-3 fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <SidebarContent />
        </CollapsibleContent>
      </Collapsible> */}
      <Map
        className="absolute left-0 w-full"
        initialViewState={{
          bounds: bbox,
        }}
        interactiveLayerIds={layersInteractiveIds}
        onClick={handleMapClick}
        onMoveEnd={handleMoveEnd}
        renderWorldCopies={false}
        attributionControl={false}
      >
        <>
          <div
            className={cn({
              'hidden md:block': drawState.active,
            })}
          >
            <LayerManager />

            {/* <Popup /> */}

            <LayersDropdown
              className={cn({
                'translate-x-0 animate-in-absolute': sidebarOpen,
                'translate-x-0 animate-out-absolute': !sidebarOpen,
              })}
            />
            <Legend />
          </div>
          <ZoomControls />
          <DrawControls />
          <LayerManager />
          <Drawing />
          <Attributions />
        </>
      </Map>
      <div className="h-1/2 flex-shrink-0 bg-white p-6 pb-3 md:hidden">
        <SidebarContent />
      </div>
    </div>
  );
};

export default MapPage;
