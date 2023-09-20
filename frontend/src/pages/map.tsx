import { useState } from 'react';

import { ChevronLeft } from 'lucide-react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';
import { RecoilURLSyncJSONNext } from 'recoil-sync-next';

import LayerManager from '@/components/layer-manager';
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
import FullscreenLayout from '@/layouts/fullscreen';
import { cn } from '@/lib/utils';
import { drawStateAtom } from '@/store/map';

const MapPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawState = useRecoilValue(drawStateAtom);

  return (
    <FullscreenLayout title="Map">
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <div className="relative flex h-full w-full flex-col md:flex-row">
          <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="hidden md:block">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn('absolute bottom-3 z-10', {
                  'left-0': !sidebarOpen,
                  'left-[430px] transition-[left] delay-500': sidebarOpen,
                })}
              >
                <ChevronLeft
                  className={cn('h-6 w-6', { 'rotate-180': !sidebarOpen })}
                  aria-hidden
                />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="relative top-0 left-0 z-20 h-full w-[430px] flex-shrink-0 bg-white p-8 pb-3 fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
              <SidebarContent />
            </CollapsibleContent>
          </Collapsible>
          <Map>
            {() => (
              <>
                <div
                  className={cn({
                    'hidden md:block': drawState.active,
                  })}
                >
                  <LayersDropdown />
                  <Legend />
                </div>
                <ZoomControls />
                <DrawControls />
                <Source
                  id="basemap"
                  type="raster"
                  tiles={['https://tile.openstreetmap.org/{z}/{x}/{y}.png']}
                  attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                  maxzoom={20}
                  tileSize={256}
                >
                  <Layer id="basemap" type="raster" />
                </Source>
                <LayerManager />
                <Drawing />
                <Attributions />
              </>
            )}
          </Map>
          <div className="h-1/2 flex-shrink-0 bg-white p-6 pb-3 md:hidden">
            <SidebarContent />
          </div>
        </div>
      </RecoilURLSyncJSONNext>
    </FullscreenLayout>
  );
};

export default MapPage;
