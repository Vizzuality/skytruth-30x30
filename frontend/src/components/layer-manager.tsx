import { FC } from 'react';

import { Layer, Source } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { LAYERS } from '@/constants/map';
import { layersAtom } from '@/store/map';

const LayerManager: FC = () => {
  const layers = useRecoilValue(layersAtom);

  return (
    <>
      {layers.map((layer) => {
        const layerDef = LAYERS.find(({ id }) => id === layer.id);
        if (!layerDef) {
          return null;
        }

        switch (layerDef.type) {
          case 'default':
            return (
              <Source key={layer.id} {...layerDef.config.source}>
                {layerDef.config.layers?.map((subLayer) => (
                  <Layer key={subLayer.id} {...subLayer} />
                ))}
              </Source>
            );
        }
      })}
    </>
  );
};

export default LayerManager;
