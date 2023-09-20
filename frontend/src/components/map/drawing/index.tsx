import { FC } from 'react';

import { Source, Layer } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { drawStateAtom } from '@/store/map';

import { DRAW_STYLES } from '../draw-controls/hooks';

const Drawing: FC = () => {
  const { active, feature } = useRecoilValue(drawStateAtom);

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
