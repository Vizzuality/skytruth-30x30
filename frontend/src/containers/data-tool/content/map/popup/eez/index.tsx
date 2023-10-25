import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import type { Feature } from 'geojson';
import { useAtomValue } from 'jotai';

import ContentLoader from '@/components/ui/loader';
import { format } from '@/lib/utils/formats';
import { layersInteractiveIdsAtom, popupAtom } from '@/store/map';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { LayerTyped } from '@/types/layers';

const EEZLayerPopup = ({ locationId }) => {
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

  const { source, click } = layerQuery.data;

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

  return (
    <ContentLoader
      data={locationQuery.data}
      isFetching={locationQuery.isFetching}
      isFetched={locationQuery.isFetched}
      isError={locationQuery.isError}
      isPlaceholderData={locationQuery.isPlaceholderData}
      skeletonClassName="h-20 w-[250px]"
    >
      <h3 className="text-base font-semibold">{locationQuery.data?.attributes?.name} EEZ</h3>
      <dl className="space-y-2">
        {click &&
          !!locationQuery.data &&
          click.values.map((v) => {
            return (
              <div key={v.key}>
                <dt className="text-xs font-semibold uppercase">{v.label || v.key}:</dt>
                <dd className="text-sm">
                  {format({
                    id: v.format?.id,
                    value: locationQuery.data.attributes[v.key],
                    options: v.format?.options,
                  })}
                </dd>
              </div>
            );
          })}
        {click && !DATA && <div className="text-xs">No data</div>}
      </dl>
    </ContentLoader>
  );
};

export default EEZLayerPopup;
