import { useEffect } from 'react';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';
import { LayerProps } from '@/types/layers';

export type DeckLayerProps<T> = LayerProps &
  T & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: any;
  };

const DeckLayer = <T,>({ id, type, ...props }: DeckLayerProps<T>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    const ly = new type({
      ...props,
      id: i,
      beforeId: id,
    });
    addLayer(ly);
  }, [i, id, type, props, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default DeckLayer;
