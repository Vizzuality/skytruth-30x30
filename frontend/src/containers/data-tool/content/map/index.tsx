import { ComponentProps, useCallback, useMemo, useRef } from 'react';

import { useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';

import Map, { ZoomControls, Attributions, DrawControls, Drawing } from '@/components/map';
import { DEFAULT_VIEW_STATE } from '@/components/map/constants';
import LabelsManager from '@/containers/data-tool/content/map/labels-manager';
import LayersToolbox from '@/containers/data-tool/content/map/layers-toolbox';
import Popup from '@/containers/data-tool/content/map/popup';
import { useSyncMapSettings } from '@/containers/data-tool/content/map/sync-settings';
import { sidebarAtom } from '@/containers/data-tool/store';
import {
  bboxLocation,
  drawStateAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
} from '@/containers/data-tool/store';
import { cn } from '@/lib/classnames';
import { useGetLayers } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { LayerTyped } from '@/types/layers';

const LayerManager = dynamic(() => import('@/containers/data-tool/content/map/layer-manager'), {
  ssr: false,
});

const DataToolMap: React.FC = () => {
  const [{ bbox: URLBbox }, setMapSettings] = useSyncMapSettings();
  const { default: map } = useMap();
  const drawState = useAtomValue(drawStateAtom);
  const isSidebarOpen = useAtomValue(sidebarAtom);
  const setPopup = useSetAtom(popupAtom);
  const { locationCode } = useParams();
  const hoveredPolygonId = useRef<string | number | null>(null);
  const locationBbox = useAtomValue(bboxLocation);

  const locationsQuery = useGetLocations(
    {},
    {
      query: {
        queryKey: ['locations', locationCode],
        staleTime: Infinity,
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

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
        .map((b) => parseFloat(b.toFixed(2))) as typeof URLBbox,
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

  const initialViewState: ComponentProps<typeof Map>['initialViewState'] = useMemo(() => {
    if (URLBbox) {
      return {
        ...DEFAULT_VIEW_STATE,
        bounds: URLBbox as ComponentProps<typeof Map>['initialViewState']['bounds'],
      };
    }

    if (locationsQuery.data && locationsQuery.data?.code !== 'GLOB') {
      return {
        ...DEFAULT_VIEW_STATE,
        bounds: locationsQuery.data?.bounds as ComponentProps<
          typeof Map
        >['initialViewState']['bounds'],
        padding: {
          top: 0,
          bottom: 0,
          left: isSidebarOpen ? 430 : 0,
          right: 0,
        },
      };
    }

    return DEFAULT_VIEW_STATE;
  }, [URLBbox, isSidebarOpen, locationsQuery.data]);

  const bounds: ComponentProps<typeof Map>['bounds'] = useMemo(() => {
    if (!locationBbox) return null;

    return {
      bbox: locationBbox as ComponentProps<typeof Map>['bounds']['bbox'],
      options: {
        padding: {
          top: 0,
          bottom: 0,
          left: isSidebarOpen ? 430 : 0,
          right: 0,
        },
      },
    };
  }, [locationBbox, isSidebarOpen]);

  return (
    <div className="absolute left-0 h-full w-full">
      <Map
        initialViewState={initialViewState}
        bounds={bounds}
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
