import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import type { Feature } from 'geojson';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useLocale, useTranslations } from 'next-intl';

import { CustomMapProps } from '@/components/map/types';
import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { bboxLocation, layersInteractiveIdsAtom, popupAtom } from '@/containers/map/store';
import { formatPercentage, formatKM } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetLocations } from '@/types/generated/location';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import { ProtectionCoverageStatListResponseDataItem } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

const RegionsPopup: FCWithMessages<{ layerId: number }> = ({ layerId }) => {
  const t = useTranslations('containers.map');
  const locale = useLocale();

  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();
  const searchParams = useMapSearchParams();
  const { push } = useRouter();
  const setLocationBBox = useSetAtom(bboxLocation);
  const [popup, setPopup] = useAtom(popupAtom);

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const layerQuery = useGetLayersId<{
    source: LayerTyped['config']['source'];
    click: LayerTyped['interaction_config']['events'][0];
  }>(
    layerId,
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      locale,
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
      locale,
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
        locale,
        filters: {
          location: {
            code: DATA?.region_id,
          },
        },
        populate: 'location',
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
    if (protectionCoverageStats?.[0]) {
      return protectionCoverageStats[0].attributes.year;
    }
  }, [protectionCoverageStats]);

  const latestProtectionCoverageStats = useMemo(() => {
    if (latestYearAvailable) {
      return protectionCoverageStats.filter((d) => d.attributes.year === latestYearAvailable);
    }
    return [];
  }, [protectionCoverageStats, latestYearAvailable]);

  const coverageStats = useMemo(() => {
    if (latestProtectionCoverageStats.length && locationsQuery.data) {
      const totalCumSumProtectedArea = latestProtectionCoverageStats.reduce(
        (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
        0
      );

      const percentage = formatPercentage(
        locale,
        (totalCumSumProtectedArea / locationsQuery.data.totalMarineArea) * 100,
        {
          displayPercentageSign: false,
        }
      );

      const protectedArea = formatKM(locale, totalCumSumProtectedArea);

      return {
        percentage,
        protectedArea,
      };
    }

    return {
      percentage: '-',
      protectedArea: '-',
    };
  }, [locale, latestProtectionCoverageStats, locationsQuery.data]);

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(map?.loaded() && map?.areTilesLoaded());
  }, [map]);

  const handleLocationSelected = useCallback(async () => {
    await push(
      `${
        PAGES.progressTracker
      }/${locationsQuery.data.code.toUpperCase()}?${searchParams.toString()}`
    );
    setLocationBBox(locationsQuery.data.marine_bounds as CustomMapProps['bounds']['bbox']);
    setPopup({});
  }, [push, searchParams, setLocationBBox, locationsQuery.data, setPopup]);

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
        <span className="text-sm">{t('loading')}</span>
      )}
      {locationsQuery.isFetched && !locationsQuery.data && (
        <span className="text-sm">{t('no-data-available')}</span>
      )}
      {locationsQuery.isFetched && locationsQuery.data && (
        <>
          <div className="space-y-2">
            <div className="my-4 max-w-[95%] font-mono">{t('marine-conservation-coverage')}</div>
            <div className="space-x-1 font-mono tracking-tighter text-black">
              {coverageStats.percentage !== '-' &&
                t.rich('percentage-bold', {
                  percentage: coverageStats.percentage,
                  b1: (chunks) => (
                    <span className="text-[64px] font-bold leading-[80%]">{chunks}</span>
                  ),
                  b2: (chunks) => <span className="text-lg">{chunks}</span>,
                })}
              {coverageStats.percentage === '-' && (
                <span className="text-[64px] font-bold leading-[80%]">
                  {coverageStats.percentage}
                </span>
              )}
            </div>
            <div className="space-x-1 font-mono font-medium text-black">
              {t('marine-protected-area', {
                protectedArea: coverageStats.protectedArea,
                totalArea: formatKM(locale, locationsQuery.data.totalMarineArea),
              })}
            </div>
          </div>
          <button
            type="button"
            className="block w-full border border-black p-4 text-center font-mono uppercase"
            onClick={handleLocationSelected}
          >
            {t('open-region-insights')}
          </button>
        </>
      )}
    </div>
  );
};

RegionsPopup.messages = ['containers.map'];

export default RegionsPopup;
