import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import type { Feature } from 'geojson';
import { useAtom, useAtomValue } from 'jotai';
import { useLocale, useTranslations } from 'next-intl';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { layersInteractiveIdsAtom, popupAtom } from '@/containers/map/store';
import { formatPercentage, formatKM } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';
import { useGetLayersId } from '@/types/generated/layer';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';
import { ProtectionCoverageStat } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

const RegionsPopup: FCWithMessages<{ layerId: number }> = ({ layerId }) => {
  const t = useTranslations('containers.map');
  const locale = useLocale();

  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();
  const searchParams = useMapSearchParams();
  const { push } = useRouter();
  const [popup, setPopup] = useAtom(popupAtom);

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const {
    data: { source, environment },
  } = useGetLayersId<{
    source: LayerTyped['config']['source'];
    environment: string;
  }>(
    layerId,
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      locale,
      fields: ['config'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        environment: {
          fields: ['slug'],
        },
      },
    },
    {
      query: {
        placeholderData: { data: {} },
        select: ({ data }) => ({
          source: (data.attributes as LayerTyped)?.config?.source,
          environment: data.attributes?.environment?.data.attributes.slug,
        }),
      },
    }
  );

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

  // ? I had to type the data ad hoc because the generated type is wrong when we are adding
  // ? the `sort` query param
  const { data: protectionCoverageStats, isFetching } =
    useGetProtectionCoverageStats<ProtectionCoverageStat>(
      {
        locale,
        filters: {
          location: {
            code: DATA?.GID_0 || DATA?.region_id,
          },
          is_last_year: {
            $eq: true,
          },
          environment: {
            slug: {
              $eq: environment,
            },
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        populate: {
          location: {
            fields: [
              ...(locale === 'en' ? ['name'] : []),
              ...(locale === 'es' ? ['name_es'] : []),
              ...(locale === 'fr' ? ['name_fr'] : []),
              'code',
              'total_marine_area',
              'total_terrestrial_area',
            ],
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fields: ['coverage', 'protected_area'],
        'pagination[limit]': 1,
      },
      {
        query: {
          select: ({ data }) => data?.[0].attributes,
          enabled: !!DATA?.region_id || !!DATA?.GID_0,
        },
      }
    );

  const formattedStats = useMemo(() => {
    if (protectionCoverageStats) {
      const percentage = formatPercentage(locale, protectionCoverageStats.coverage, {
        displayPercentageSign: false,
      });

      const protectedArea = formatKM(locale, protectionCoverageStats.protected_area);

      return {
        percentage,
        protectedArea,
      };
    }

    return {
      percentage: '-',
      protectedArea: '-',
    };
  }, [locale, protectionCoverageStats]);

  const localizedLocationName = useMemo(() => {
    if (!protectionCoverageStats) {
      return null;
    }

    if (locale === 'es') {
      return protectionCoverageStats.location.data.attributes.name_es;
    }

    if (locale === 'fr') {
      return protectionCoverageStats.location.data.attributes.name_fr;
    }

    return protectionCoverageStats.location.data.attributes.name;
  }, [locale, protectionCoverageStats]);

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(map?.loaded() && map?.areTilesLoaded());
  }, [map]);

  const handleLocationSelected = useCallback(async () => {
    if (!protectionCoverageStats?.location?.data.attributes) return undefined;

    const { code } = protectionCoverageStats.location.data.attributes;

    await push(`${PAGES.progressTracker}/${code.toUpperCase()}?${searchParams.toString()}`);
    setPopup({});
  }, [push, searchParams, protectionCoverageStats, setPopup]);

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
      <h3 className="text-xl font-semibold">{localizedLocationName || '-'}</h3>
      {isFetching && <div className="my-4 text-center font-mono text-xs">{t('loading')}</div>}
      {!isFetching && !protectionCoverageStats && (
        <div className="my-4 text-center font-mono text-xs">{t('no-data-available')}</div>
      )}
      {!isFetching && !!protectionCoverageStats && (
        <>
          <div className="space-y-2">
            <div className="my-4 max-w-[95%] font-mono">
              {environment === 'marine'
                ? t('marine-conservation-coverage')
                : t('terrestrial-conservation-coverage')}
            </div>
            <div className="space-x-1 font-mono tracking-tighter text-black">
              {formattedStats.percentage !== '-' &&
                t.rich('percentage-bold', {
                  percentage: formattedStats.percentage,
                  b1: (chunks) => (
                    <span className="text-[64px] font-bold leading-[80%]">{chunks}</span>
                  ),
                  b2: (chunks) => <span className="text-lg">{chunks}</span>,
                })}
              {formattedStats.percentage === '-' && (
                <span className="text-[64px] font-bold leading-[80%]">
                  {formattedStats.percentage}
                </span>
              )}
            </div>
            <div className="space-x-1 font-mono font-medium text-black">
              {t('marine-protected-area', {
                protectedArea: formattedStats.protectedArea,
                totalArea: formatKM(
                  locale,
                  Number(protectionCoverageStats?.location.data.attributes.total_marine_area)
                ),
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
