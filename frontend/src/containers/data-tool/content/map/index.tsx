import { ComponentProps, useCallback, useEffect, useRef } from 'react';

import { useMap } from 'react-map-gl';
import { LngLatBoundsLike } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

import Map, { ZoomControls, Attributions, DrawControls, Drawing } from '@/components/map';
import LabelsManager from '@/containers/data-tool/content/map/labels-manager';
import LayersToolbox from '@/containers/data-tool/content/map/layers-toolbox';
import Popup from '@/containers/data-tool/content/map/popup';
import { useSyncMapSettings } from '@/containers/data-tool/content/map/sync-settings';
import { cn } from '@/lib/classnames';
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
  const hoveredPolygonId = useRef<string | number | null>(null);

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

  const handleMouseMove = useCallback(
    (e: Parameters<ComponentProps<typeof Map>['onMouseOver']>[0]) => {
      if (e.features.length > 0) {
        if (hoveredPolygonId.current !== null) {
          map.setFeatureState(
            {
              source: e.features?.[0].source,
              id: hoveredPolygonId.current,
              sourceLayer: e.features?.[0].sourceLayer,
            },
            { hover: false }
          );
        }
        map.setFeatureState(
          {
            source: e.features?.[0].source,
            id: e.features[0].id,
            sourceLayer: e.features?.[0].sourceLayer,
          },
          { hover: true }
        );

        hoveredPolygonId.current = e.features[0].id;
      }
    },
    [map, hoveredPolygonId]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoveredPolygonId.current !== null) {
      map.setFeatureState(
        // ? not a fan of harcoding the sources here, but there is no other way to find out the source
        { source: 'ezz-source', id: hoveredPolygonId.current, sourceLayer: 'eez_v11' },
        { hover: false }
      );
    }
  }, [map, hoveredPolygonId]);

  const bounds = customBbox ?? (locationData?.attributes?.bounds as LngLatBoundsLike);

  useEffect(() => {
    const { queryKey } = getGetLocationsQueryOptions();
    const d = queryClient.getQueryData<LocationListResponse>(queryKey);
    if (d) {
      const location = d.data.find(({ attributes }) => attributes.code === locationCode);

      map?.fitBounds(location.attributes.bounds as LngLatBoundsLike, {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });
    }
  }, [queryClient, locationCode, map]);

  return (
    <div className="absolute left-0 h-full w-full">
      <Map
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        renderWorldCopies={false}
        attributionControl={false}
      >
        <>
          <div
            className={cn({
              'hidden md:block': drawState.active,
            })}
          >
            <Popup />
          </div>
          <LabelsManager />
          <LayersToolbox />
          <ZoomControls />
          <DrawControls />
          <LayerManager />
          <Drawing />
          <Attributions />
        </>
      </Map>
    </div>
  );
};

export default DataToolMap;
