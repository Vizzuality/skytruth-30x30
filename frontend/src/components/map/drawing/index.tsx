import { FC, useEffect } from 'react';

import { Source, Layer, LngLatBoundsLike, useMap } from 'react-map-gl';

import { bbox } from '@turf/turf';
import { useRecoilValue } from 'recoil';

import { DRAW_STYLES } from '../draw-controls/hooks';

import { drawStateAtom } from '@/store/map';

const Drawing: FC = () => {
  const { current: map } = useMap();
  const { active, feature } = useRecoilValue(drawStateAtom);

  useEffect(() => {
    if (map && feature) {
      const geojsonBbox = bbox(feature);

      map.fitBounds(geojsonBbox as LngLatBoundsLike, {
        animate: true,
        padding: 20,
      });
    }
  }, [map, feature]);

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

export default Drawing;
