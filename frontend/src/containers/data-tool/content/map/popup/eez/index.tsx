import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import Link from 'next/link';

import type { Feature } from 'geojson';
import { useAtomValue } from 'jotai';

import { PAGES } from '@/constants/pages';
import { layersInteractiveIdsAtom, popupAtom } from '@/containers/data-tool/store';
import { format } from '@/lib/utils/formats';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { LayerTyped } from '@/types/layers';

import { useDataToolSearchParams } from '../../sync-settings';

const TERMS_CLASSES = 'font-mono uppercase';

const EEZLayerPopup = ({ locationId }) => {
  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();
  const searchParams = useDataToolSearchParams();

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
        code: DATA?.ISO_SOV1,
      },
    },
    {
      query: {
        enabled: !!DATA?.ISO_SOV1,
        select: ({ data }) => data[0],
      },
    }
  );

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(!!map?.loaded() && !!map?.areTilesLoaded());
  }, [map]);

  useEffect(() => {
    map?.on('render', handleMapRender);

    return () => {
      map?.off('render', handleMapRender);
    };
  }, [map, handleMapRender]);

  if (!DATA) return null;

  return (
    <>
      <div className="space-y-2 p-4">
        <h3 className="text-xl font-semibold">{DATA?.GEONAME}</h3>
        {locationQuery.isFetching && !locationQuery.isFetched && (
          <span className="text-sm">Loading...</span>
        )}
        {locationQuery.isFetched && !locationQuery.data && (
          <span className="text-sm">No data available</span>
        )}
        {locationQuery.isFetched && locationQuery.data && (
          <>
            <dl className="space-y-2">
              <dt className={TERMS_CLASSES}>Marine conservation coverage</dt>
              <dd className="font-mono text-6xl tracking-tighter text-blue">
                39<span className="text-xl">%</span>
              </dd>
              <dd className="font-mono text-xl text-blue">
                {format({
                  value: locationQuery.data?.attributes?.totalMarineArea,
                  id: 'formatKM',
                })}
                Km<sup>2</sup>
              </dd>
            </dl>
            <Link
              className="block border border-black p-4 text-center font-mono uppercase"
              href={`${
                PAGES.dataTool
              }/${locationQuery.data?.attributes?.code.toUpperCase()}?${searchParams.toString()}`}
            >
              Open country insights
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default EEZLayerPopup;
