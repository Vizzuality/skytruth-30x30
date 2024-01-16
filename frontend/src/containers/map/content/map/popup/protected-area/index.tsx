import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import type { Feature } from 'geojson';
import { useAtomValue } from 'jotai';

import { layersInteractiveIdsAtom, popupAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { LayerTyped } from '@/types/layers';

const TERMS_CLASSES = 'font-mono uppercase';

const ProtectedAreaPopup = ({ locationId }: { locationId: number }) => {
  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();

  const popup = useAtomValue(popupAtom);
  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const layerQuery = useGetLayersId(
    locationId,
    {
      populate: 'metadata',
    },
    {
      query: {
        select: ({ data }) => ({
          source: (data.attributes as LayerTyped).config?.source,
          click: (data.attributes as LayerTyped)?.interaction_config?.events.find(
            (ev) => ev.type === 'click'
          ),
        }),
      },
    }
  );

  const { source } = layerQuery.data;

  const DATA = useMemo(() => {
    if (source?.type === 'vector' && rendered && popup && map) {
      const point = map.project(popup.lngLat);

      // check if the point is outside the canvas
      if (
        point.x < 0 ||
        point.x > map.getCanvas().width ||
        point.y < 0 ||
        point.y > map.getCanvas().height
      ) {
        return DATA_REF.current;
      }
      const query = map.queryRenderedFeatures(point, {
        layers: layersInteractiveIds,
      });

      const d = query.find((d) => {
        return d.source === source.id;
      })?.properties;

      DATA_REF.current = d;

      if (d) {
        return DATA_REF.current;
      }
    }

    return DATA_REF.current;
  }, [popup, source, layersInteractiveIds, map, rendered]);

  const locationQuery = useGetLocations(
    {
      filters: {
        code: 'GLOB',
      },
    },
    {
      query: {
        select: ({ data }) => data[0],
      },
    }
  );

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(map?.loaded() && map?.areTilesLoaded());
  }, [map]);

  useEffect(() => {
    map?.on('render', handleMapRender);

    setRendered(map?.loaded() && map?.areTilesLoaded());

    return () => {
      map?.off('render', handleMapRender);
    };
  }, [map, handleMapRender]);

  if (!DATA) return null;

  const globalCoveragePercentage = (DATA.REP_M_AREA / locationQuery.data?.attributes?.totalMarineArea) * 100;

  const classNameByMPAType = cn({
    'text-green': DATA?.PA_DEF === '1',
    'text-violet': DATA?.PA_DEF === '0',
  });

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{DATA?.NAME}</h3>
        {locationQuery.isFetching && !locationQuery.isFetched && (
          <span className="text-sm">Loading...</span>
        )}
        {locationQuery.isFetched && !locationQuery.data && (
          <span className="text-sm">No data available</span>
        )}
        {locationQuery.isFetched && locationQuery.data && (
          <>
            <dl className="space-y-2">
              <dt className={TERMS_CLASSES}>Global coverage</dt>
              <dd className={`font-mono text-6xl tracking-tighter ${classNameByMPAType}`}>
                {format({
                  value: globalCoveragePercentage,
                  id: 'formatPercentage',
                })}
              </dd>
              <dd className={`font-mono text-xl ${classNameByMPAType}`}>
                {format({
                  value: DATA?.REP_M_AREA,
                  id: 'formatKM',
                  options: {
                    maximumSignificantDigits: 3,
                  },
                })}
                Km<sup>2</sup>
              </dd>
            </dl>
          </>
        )}
      </div>
    </>
  );
};

export default ProtectedAreaPopup;
