import { FC, useMemo } from 'react';

import { AttributionControl } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { LAYERS } from '@/constants/map';
import { layersAtom } from '@/store/map';

const Attributions: FC = () => {
  const activeLayers = useRecoilValue(layersAtom);

  const customAttributions = useMemo(() => {
    return activeLayers
      .map((layer) => {
        const layerDef = LAYERS.find(({ id }) => id === layer.id);
        if (!layerDef) {
          return;
        }

        return layerDef.metadata?.attributions;
      })
      .filter((attributions) => !!attributions);
  }, [activeLayers]);

  return (
    <AttributionControl
      key={customAttributions.join('')}
      compact={false}
      customAttribution={customAttributions}
    />
  );
};

export default Attributions;
