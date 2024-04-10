import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { useAtom, useAtomValue } from 'jotai';

import Map, { ZoomControls, Attributions } from '@/components/map';
import { DEFAULT_VIEW_STATE } from '@/components/map/constants';
import DrawControls from '@/containers/map/content/map/draw-controls';
import LabelsManager from '@/containers/map/content/map/labels-manager';
import LayersLegend from '@/containers/map/content/map/legend';
import Modelling from '@/containers/map/content/map/modelling';
import Popup from '@/containers/map/content/map/popup';
import { useSyncMapSettings } from '@/containers/map/content/map/sync-settings';
import { sidebarAtom } from '@/containers/map/store';
import {
  bboxLocation,
  drawStateAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
} from '@/containers/map/store';
import { useGetLayers } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { LayerTyped } from '@/types/layers';

const LayerManager = dynamic(() => import('@/containers/map/content/map/layer-manager'), {
  ssr: false,
});

const MainMap: React.FC = () => {
  const [{ bbox: URLBbox }, setMapSettings] = useSyncMapSettings();
  const { default: map } = useMap();
  const drawState = useAtomValue(drawStateAtom);
  const isSidebarOpen = useAtomValue(sidebarAtom);
  const [popup, setPopup] = useAtom(popupAtom);
  const params = useParams();
  const locationBbox = useAtomValue(bboxLocation);
  const hoveredPolygonId = useRef<Parameters<typeof map.setFeatureState>[0] | null>(null);
  const [cursor, setCursor] = useState<'grab' | 'crosshair' | 'pointer'>('grab');

  const locationCode = params?.locationCode || 'GLOB';

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        queryKey: ['locations', locationCode],
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
      if (drawState.active) return null;

      if (popup?.features?.length && hoveredPolygonId.current !== null) {
        map.setFeatureState(
          {
            source: hoveredPolygonId.current.source,
            id: hoveredPolygonId.current.id,
            sourceLayer: hoveredPolygonId.current.sourceLayer,
          },
          { hover: false }
        );

        setPopup({});
      }

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
    [layersInteractive, layersInteractiveData, setPopup, drawState, popup, map]
  );

  const handleMouseMove = useCallback(
    (e: Parameters<ComponentProps<typeof Map>['onMouseOver']>[0]) => {
      if (!e.features.length) {
        setPopup({});
      }

      if (e?.features?.length > 0) {
        if (!drawState.active) {
          setCursor('pointer');
        }

        if (e.type === 'mousemove') {
          setPopup({ ...e });
        }

        if (hoveredPolygonId.current !== null) {
          map.setFeatureState(
            {
              source: e.features?.[0].source,
              id: hoveredPolygonId.current.id,
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

        hoveredPolygonId.current = e.features[0];
      } else {
        if (!drawState.active) {
          setCursor('grab');
        }
      }
    },
    [map, hoveredPolygonId, drawState.active, setPopup]
  );

  const handleMouseLeave = useCallback(() => {
    if (popup?.features?.length) return;
    if (hoveredPolygonId.current !== null) {
      map.setFeatureState(
        {
          source: hoveredPolygonId.current.source,
          id: hoveredPolygonId.current.id,
          sourceLayer: hoveredPolygonId.current.sourceLayer,
        },
        { hover: false }
      );
    }
    setPopup({});
  }, [map, hoveredPolygonId, popup, setPopup]);

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

  useEffect(() => {
    setCursor(drawState.active ? 'crosshair' : 'grab');
  }, [drawState.active]);

  useEffect(() => {
    if (!popup?.features?.length && hoveredPolygonId.current !== null) {
      map.setFeatureState(
        {
          source: hoveredPolygonId.current.source,
          id: hoveredPolygonId.current.id,
          sourceLayer: hoveredPolygonId.current.sourceLayer,
        },
        { hover: false }
      );
    }
  }, [map, popup]);

  const disableMouseMove = popup.type === 'click' && popup.features?.length;

  // ? the popup won't show up when the user is hovering a layer that is not EEZ
  const hidePopup =
    popup?.type === 'mousemove' && !popup.features?.some((f) => f.source === 'ezz-source');

  return (
    <div className="absolute left-0 h-full w-full border-r border-b border-black">
      <Map
        initialViewState={initialViewState}
        bounds={bounds}
        interactiveLayerIds={!drawState.active && !drawState.feature ? layersInteractiveIds : []}
        onClick={handleMapClick}
        onMoveEnd={handleMoveEnd}
        onMouseMove={!disableMouseMove && handleMouseMove}
        onMouseLeave={handleMouseLeave}
        attributionControl={false}
        cursor={cursor}
      >
        <>
          {!hidePopup && <Popup />}
          <LabelsManager />
          <LayersLegend />
          <ZoomControls />
          <DrawControls />
          <LayerManager cursor={cursor} />
          <Modelling />
          <Attributions />
        </>
      </Map>
    </div>
  );
};

export default MainMap;
