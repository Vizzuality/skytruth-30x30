import { Layer } from 'react-map-gl';

import { DeckMapboxOverlayProvider } from '@/components/map/provider';
import LayerManagerItem from '@/containers/map/layer-manager/item';
import { useSyncMapLayerSettings, useSyncMapLayers } from '@/containers/map/sync-settings';

const LayerManager = () => {
  const [activeLayers] = useSyncMapLayers();
  const [layersSettings] = useSyncMapLayerSettings();

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/*
          Generate all transparent backgrounds to be able to sort by layers without an error
          - https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
        */}
        {activeLayers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${activeLayers[i - 1]}-layer`;
          return (
            <Layer
              id={`${l}-layer`}
              key={l}
              type="background"
              layout={{ visibility: 'none' }}
              beforeId={beforeId}
            />
          );
        })}

        {/*
          Loop through active layers. The id is gonna be used to fetch the current layer and know how to order the layers.
          The first item will always be at the top of the layers stack
        */}
        {activeLayers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${activeLayers[i - 1]}-layer`;
          return (
            <LayerManagerItem
              key={l}
              id={l}
              beforeId={beforeId}
              settings={layersSettings[l] ?? { opacity: 1, visibility: true, expand: true }}
            />
          );
        })}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;
