import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useParams } from 'next/navigation';
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

const EEZLayerPopup: FCWithMessages<{ layerId: number }> = ({ layerId }) => {
  const t = useTranslations('containers.map');
  const locale = useLocale();

  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();
  const { default: map } = useMap();
  const searchParams = useMapSearchParams();
  const { push } = useRouter();
  const [popup, setPopup] = useAtom(popupAtom);
  const { locationCode } = useParams();

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const { data: source } = useGetLayersId<LayerTyped['config']['source']>(
    layerId,
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: ['config'],
    },
    {
      query: {
        select: ({ data }) => (data.attributes as LayerTyped).config?.source,
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

  const selectedLocationCode: string = Object.keys(DATA || {})
    .filter((key) => key.startsWith('ISO_') && DATA[key])
    .map((key) => DATA[key])
    .find((code, index, codes) => {
      if (codes.length > 1) return code === locationCode;
      return true;
    });

  const { data: protectionCoverageStats, isFetching } =
    useGetProtectionCoverageStats<ProtectionCoverageStat>(
      {
        locale,
        filters: {
          location: {
            code: selectedLocationCode,
          },
          is_last_year: {
            $eq: true,
          },
          environment: {
            slug: {
              $eq: 'marine',
            },
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        populate: {
          location: {
            fields: ['code', 'total_marine_area'],
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fields: ['coverage', 'protected_area'],
        'pagination[limit]': 1,
      },
      {
        query: {
          enabled: !!selectedLocationCode,
          select: ({ data }) => {
            if (!data?.length) return undefined;
            return data[0].attributes;
          },
        },
      }
    );

  const formattedCoverage = useMemo(() => {
    if (protectionCoverageStats?.coverage !== undefined) {
      return formatPercentage(locale, protectionCoverageStats.coverage, {
        displayPercentageSign: false,
      });
    }

    return '-';
  }, [locale, protectionCoverageStats]);

  const EEZName = useMemo(() => {
    let name = null;

    if (!DATA) {
      return name;
    }

    if (locale === 'es') {
      name = DATA.GEONAME_ES;
    }

    if (locale === 'fr') {
      name = DATA.GEONAME_FR;
    }

    return name ?? DATA.GEONAME;
  }, [locale, DATA]);

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
      <h3 className="text-xl font-semibold">{EEZName}</h3>
      {isFetching && <div className="my-4 text-center font-mono text-xs">{t('loading')}</div>}
      {!isFetching && !protectionCoverageStats && (
        <div className="my-4 text-center font-mono text-xs">{t('no-data-available')}</div>
      )}
      {!isFetching && !!protectionCoverageStats && (
        <>
          <div className="space-y-2">
            <div className="my-4 max-w-[95%] font-mono">{t('marine-conservation-coverage')}</div>
            <div className="space-x-1 font-mono tracking-tighter text-black">
              {formattedCoverage !== '-' &&
                t.rich('percentage-bold', {
                  percentage: formattedCoverage,
                  b1: (chunks) => (
                    <span className="text-[64px] font-bold leading-[80%]">{chunks}</span>
                  ),
                  b2: (chunks) => <span className="text-lg">{chunks}</span>,
                })}
              {formattedCoverage === '-' && (
                <span className="text-[64px] font-bold leading-[80%]">{formattedCoverage}</span>
              )}
            </div>
            <div className="space-x-1 font-mono text-xs font-medium text-black">
              {t('protected-area', {
                protectedArea: formatKM(locale, protectionCoverageStats.protected_area),
                totalArea: formatKM(
                  locale,
                  Number(protectionCoverageStats.location.data.attributes.total_marine_area)
                ),
              })}
            </div>
          </div>
          {!!selectedLocationCode && (
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
