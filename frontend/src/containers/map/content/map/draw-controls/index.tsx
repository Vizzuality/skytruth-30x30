import { FC, useCallback, useEffect, useMemo } from 'react';

import { Layer, LngLatBoundsLike, useMap, Source } from 'react-map-gl';

import { bbox } from '@turf/turf';
import { useAtom, useAtomValue } from 'jotai';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {
  DRAW_STYLES,
  useMapboxDraw,
  UseMapboxDrawProps,
} from '@/components/map/draw-controls/hooks';
import { drawStateAtom, sidebarAtom } from '@/containers/map/store';

const DrawControls: FC = () => {
  const [{ active, feature }, setDrawState] = useAtom(drawStateAtom);
  const isSidebarOpen = useAtomValue(sidebarAtom);
  const { current: map } = useMap();

  const onCreate: UseMapboxDrawProps['onCreate'] = useCallback(
    ({ features }) => {
      setDrawState((prevState) => ({
        ...prevState,
        status: 'success',
        feature: features[0],
      }));
    },
    [setDrawState]
  );

  const onClick: UseMapboxDrawProps['onClick'] = useCallback(() => {
    setDrawState((prevState) => ({
      ...prevState,
      status: 'drawing',
    }));
  }, [setDrawState]);

  const useMapboxDrawProps = useMemo(
    () => ({
      enabled: active,
      onCreate,
      onClick,
    }),
    [active, onClick, onCreate]
  );

  useMapboxDraw(useMapboxDrawProps);

  useEffect(() => {
    if (map && feature) {
      const geojsonBbox = bbox(feature);

      map.fitBounds(geojsonBbox as LngLatBoundsLike, {
        animate: true,
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: isSidebarOpen ? 430 : 0,
        },
      });
    }
  }, [map, feature, isSidebarOpen]);

  if (active || !feature) {
    return null;
  }

  return (
    <Source
      id="drawing"
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: [feature],
      }}
    >
      {DRAW_STYLES.filter((layer) => layer.type !== 'circle').map((layer) => (
        <Layer key={layer.id} {...layer} />
      ))}
    </Source>
  );
};

export default DrawControls;
