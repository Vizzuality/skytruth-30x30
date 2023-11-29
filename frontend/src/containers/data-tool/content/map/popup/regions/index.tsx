import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import Link from 'next/link';

import type { Feature } from 'geojson';
import { useAtomValue } from 'jotai';

import { PAGES } from '@/constants/pages';
import { useDataToolSearchParams } from '@/containers/data-tool/content/map/sync-settings';
import { layersInteractiveIdsAtom, popupAtom } from '@/containers/data-tool/store';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import { ProtectionCoverageStatListResponseDataItem } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

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

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: DATA?.region_id,
      },
    },
    {
      query: {
        enabled: !!DATA?.region_id,
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

  // ? I had to type the data ad hoc because the generated type is wrong when we are adding
  // ? the `sort` query param
  const { data: protectionCoverageStats }: { data: ProtectionCoverageStatListResponseDataItem[] } =
    useGetProtectionCoverageStats(
      {
        filters: {
          location: {
            code: DATA?.region_id,
          },
        },
        populate: '*',
        // @ts-expect-error this is an issue with Orval typing
        'sort[year]': 'desc',
        'pagination[limit]': -1,
      },
      {
        query: {
          select: ({ data }) => data,
          enabled: !!DATA?.region_id,
        },
      }
    );

  const latestYearAvailable = useMemo(() => {
    if (protectionCoverageStats) {
      return protectionCoverageStats[0].attributes.year;
    }
  }, [protectionCoverageStats]);

  const latestProtectionCoverageStats = useMemo(() => {
    if (latestYearAvailable) {
      return protectionCoverageStats.filter((d) => d.attributes.year === latestYearAvailable);
    }
    return [];
  }, [protectionCoverageStats, latestYearAvailable]);

  const coveragePercentage = useMemo(() => {
    if (latestProtectionCoverageStats.length && locationsQuery.data) {
      const totalCumSumProtectedArea = latestProtectionCoverageStats.reduce(
        (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
        0
      );

      const formatter = Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
      });

      return formatter.format(
        (totalCumSumProtectedArea / locationsQuery.data.totalMarineArea) * 100
      );
    }

    return '-';
  }, [latestProtectionCoverageStats, locationsQuery.data]);

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

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{locationsQuery.data?.name || '-'}</h3>
      {locationsQuery.isFetching && !locationsQuery.isFetched && (
        <span className="text-sm">Loading...</span>
      )}
      {locationsQuery.isFetched && !locationsQuery.data && (
        <span className="text-sm">No data available</span>
      )}
      {locationsQuery.isFetched && locationsQuery.data && (
        <>
          <div className="space-y-2">
            <div className="font-mono uppercase">Marine conservation coverage</div>
            <div className="space-x-1 font-mono tracking-tighter text-blue">
              <span className="text-[64px] font-bold leading-[80%]">{coveragePercentage}</span>
              {coveragePercentage !== '-' && <span className="text-lg">%</span>}
            </div>
            <div className="space-x-1 font-mono text-xl text-blue">
              <span>
                {Intl.NumberFormat('en-US', {
                  notation: 'standard',
                }).format(locationsQuery.data.totalMarineArea)}
              </span>
              <span>
                km<sup>2</sup>
              </span>
            </div>
          </div>
          <Link
            className="block border border-black p-4 text-center font-mono uppercase"
            href={`${
              PAGES.dataTool
            }/${locationsQuery.data.code.toUpperCase()}?${searchParams.toString()}`}
          >
            Open country insights
          </Link>
        </>
      )}
    </div>
  );
};

export default EEZLayerPopup;
