import { ComponentProps, useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';
import { LngLatBoundsLike } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

import Map, { ZoomControls, Attributions, DrawControls, Drawing } from '@/components/map';
import SidebarContent from '@/components/sidebar-content';
// import Popup from '@/containers/map/popup';
import LayersToolbox from '@/containers/data-tool/content/map/layers-toolbox';
import { useSyncMapSettings } from '@/containers/data-tool/content/map/sync-settings';
import { cn } from '@/lib/classnames';
import { sidebarAtom } from '@/store/data-tool';
import {
  drawStateAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
} from '@/store/map';
import { useGetLayers } from '@/types/generated/layer';
import { getGetLocationsQueryOptions } from '@/types/generated/location';
import { LocationListResponse, LocationResponseDataObject } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

const LayerManager = dynamic(() => import('@/containers/data-tool/content/map/layer-manager'), {
  ssr: false,
});

const DataToolMap: React.FC = () => {
  const [{ bbox: customBbox }, setMapSettings] = useSyncMapSettings();
  const { default: map } = useMap();
  const drawState = useAtomValue(drawStateAtom);
  const setPopup = useSetAtom(popupAtom);
  const queryClient = useQueryClient();
  const { locationCode } = useParams();
  const isSidebarOpen = useAtomValue(sidebarAtom);

  const locationData = queryClient.getQueryData<LocationResponseDataObject>([
    'locations',
    locationCode,
  ]);

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
        .map((b) => parseFloat(b.toFixed(2))) as typeof customBbox,
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

  const bounds = customBbox ?? (locationData?.attributes?.bounds as LngLatBoundsLike);

  useEffect(() => {
    map?.easeTo({
      padding: {
        top: 0,
        bottom: 0,
        left: isSidebarOpen ? 430 : 0,
        right: 0,
      },
      duration: 500,
    });
  }, [isSidebarOpen, map]);

  useEffect(() => {
    const { queryKey } = getGetLocationsQueryOptions();
    const d = queryClient.getQueryData<LocationListResponse>(queryKey);
    if (d) {
      const location = d.data.find(({ attributes }) => attributes.code === locationCode);

      map?.fitBounds(location.attributes.bounds as LngLatBoundsLike, {
        padding: {
          top: 0,
          bottom: 0,
          left: isSidebarOpen ? 430 : 0,
          right: 0,
        },
      });
    }
  }, [queryClient, locationCode, isSidebarOpen, map]);

  return (
    <div className="absolute left-0 flex h-full w-full flex-col md:flex-row">
      <Map
        className="absolute left-0 w-full"
        initialViewState={{
          bounds,
          fitBoundsOptions: {
            padding: {
              top: 0,
              bottom: 0,
              left: customBbox ? 0 : 430,
              right: 0,
            },
          },
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
            {/* <Popup /> */}
          </div>
          <LayersToolbox />
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

export default DataToolMap;
