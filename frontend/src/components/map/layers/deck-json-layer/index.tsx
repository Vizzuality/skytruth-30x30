import { useEffect } from 'react';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';
import { LayerProps } from '@/types/layers';

export type DeckJsonLayerProps<T> = LayerProps &
  Partial<T> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any;
  };

const DeckJsonLayer = <T,>({ id, config }: DeckJsonLayerProps<T>) => {
  // Render deck config
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    addLayer(config.clone({ id: i, beforeId: id }));
  }, [i, id, config, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default DeckJsonLayer;
