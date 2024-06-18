import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useQueries } from '@tanstack/react-query';
import type { Feature } from 'geojson';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { CustomMapProps } from '@/components/map/types';
import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { bboxLocation, layersInteractiveIdsAtom, popupAtom } from '@/containers/map/store';
import { formatPercentage, formatKM } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';
import { useGetLayersId } from '@/types/generated/layer';
import { getGetLocationsQueryOptions } from '@/types/generated/location';
import { getGetProtectionCoverageStatsQueryOptions } from '@/types/generated/protection-coverage-stat';
import { ProtectionCoverageStatListResponseDataItem } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

const EEZLayerPopup: FCWithMessages<{ layerId: number }> = ({ layerId }) => {
  const t = useTranslations('containers.map');

  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();
  const searchParams = useMapSearchParams();
  const { locale, push } = useRouter();
  const [, setLocationBBox] = useAtom(bboxLocation);
  const [popup, setPopup] = useAtom(popupAtom);
  const { locationCode } = useParams();

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const layerQuery = useGetLayersId(
    layerId,
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

  const locationCodes = Object.keys(DATA || {})
    .filter((key) => key.startsWith('ISO_') && DATA[key])
    .map((key) => DATA[key])
    .filter((code, index, codes) => {
      if (codes.length > 1) return code === locationCode;
      return true;
    });

  const locationQueries = useQueries({
    queries: locationCodes.map((code) =>
      getGetLocationsQueryOptions(
        {
          filters: {
            code,
          },
        },
        {
          query: {
            enabled: Boolean(code),
            select: ({ data }) => data?.[0]?.attributes,
          },
        }
      )
    ),
  });

  const locationsData = useMemo(
    () =>
      locationQueries
        .map((query) => {
          if (['loading', 'error'].includes(query.status)) return null;

          return query.data;
        })
        .filter((d) => Boolean(d)),
    [locationQueries]
  );

  const protectionCoverageStatsQueries = useQueries({
    queries: locationCodes.map((code) =>
      getGetProtectionCoverageStatsQueryOptions(
        {
          filters: {
            location: {
              code,
            },
          },
          populate: '*',
          // @ts-expect-error this is an issue with Orval typing
          'sort[year]': 'desc',
          'pagination[limit]': -1,
        },
        {
          query: {
            select: ({ data }) => {
              if (!data?.length) return undefined;

              const latestYear = data[0].attributes.year;

              const latestStats = data.filter((d) => d.attributes.year === latestYear);

              const cumSumProtectedArea = latestStats.reduce(
                (acc, entry) => acc + entry.attributes.cumSumProtectedArea,
                0
              );

              return {
                cumSumProtectedArea,
              };
            },
          },
        }
      )
    ),
  });

  const protectionCoverageStatsData: { cumSumProtectedArea: number }[] = useMemo(
    () =>
      protectionCoverageStatsQueries
        .map((query) => {
          if (!query.isSuccess) return null;

          return query.data as {
            cumSumProtectedArea: ProtectionCoverageStatListResponseDataItem['attributes']['cumSumProtectedArea'];
          };
        })
        .filter((d) => Boolean(d)),
    [protectionCoverageStatsQueries]
  );

  const totalCumSumProtectedArea = useMemo(() => {
    if (!protectionCoverageStatsData.length) return 0;

    return protectionCoverageStatsData.reduce(
      (acc, { cumSumProtectedArea }) => acc + cumSumProtectedArea,
      0
    );
  }, [protectionCoverageStatsData]);

  const totalMarineArea = useMemo(() => {
    if (!locationsData.length) return 0;

    return locationsData.reduce((acc, { totalMarineArea }) => acc + totalMarineArea, 0);
  }, [locationsData]);

  const coveragePercentage = useMemo(() => {
    if (locationsData.length) {
      return formatPercentage(locale, (totalCumSumProtectedArea / totalMarineArea) * 100, {
        displayPercentageSign: false,
      });
    }

    return '-';
  }, [locale, totalCumSumProtectedArea, totalMarineArea, locationsData]);

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(map?.loaded() && map?.areTilesLoaded());
  }, [map]);

  const handleLocationSelected = useCallback(async () => {
    if (!locationsData[0]) return undefined;

    const { code, bounds } = locationsData[0];

    await push(`${PAGES.progressTracker}/${code.toUpperCase()}?${searchParams.toString()}`);
    setLocationBBox(bounds as CustomMapProps['bounds']['bbox']);
    setPopup({});
  }, [push, searchParams, setLocationBBox, locationsData, setPopup]);

  useEffect(() => {
    map?.on('render', handleMapRender);

    setRendered(map?.loaded() && map?.areTilesLoaded());

    return () => {
      map?.off('render', handleMapRender);
    };
  }, [map, handleMapRender]);

  const isFetchedLocations = locationQueries.every((query) => query.isFetched);
  const isFetchingLocations =
    !isFetchedLocations && locationQueries.some((query) => query.isFetching);
  const isEmptyLocations = isFetchedLocations && locationQueries.some((query) => !query.data);

  if (!DATA) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{DATA?.GEONAME}</h3>
      {isFetchingLocations && <span className="text-sm">{t('loading')}</span>}
      {isEmptyLocations && <span className="text-sm">{t('no-data-available')}</span>}
      {!isEmptyLocations && (
        <>
          <div className="space-y-2">
            <div className="my-4 max-w-[95%] font-mono">{t('marine-conservation-coverage')}</div>
            <div className="space-x-1 font-mono tracking-tighter text-black">
              {coveragePercentage !== '-' &&
                t.rich('percentage-bold', {
                  percentage: coveragePercentage,
                  b1: (chunks) => (
                    <span className="text-[64px] font-bold leading-[80%]">{chunks}</span>
                  ),
                  b2: (chunks) => <span className="text-lg">{chunks}</span>,
                })}
              {coveragePercentage === '-' && (
                <span className="text-[64px] font-bold leading-[80%]">{coveragePercentage}</span>
              )}
            </div>
            <div className="space-x-1 font-mono text-xs font-medium text-black">
              {t('marine-protected-area', {
                protectedArea: formatKM(locale, totalCumSumProtectedArea),
                totalArea: formatKM(locale, totalMarineArea),
              })}
            </div>
          </div>
          {locationCodes?.length === 1 && (
            <button
              type="button"
              className="block w-full border border-black p-4 text-center font-mono uppercase"
              onClick={handleLocationSelected}
            >
              {t('open-country-insights')}
            </button>
          )}
        </>
      )}
    </div>
  );
};

EEZLayerPopup.messages = ['containers.map'];

export default EEZLayerPopup;
