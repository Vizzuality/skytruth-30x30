import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { Config, LayerProps } from '@/types/layers';

export type MapboxLayerProps = LayerProps & {
  config: Config;
  beforeId?: string;
};

const MapboxLayer = ({ beforeId, config, onAdd, onRemove }: MapboxLayerProps) => {
  const SOURCE = config.source;
  const STYLES = config.styles;

  useEffect(() => {
    if (SOURCE && STYLES && onAdd) {
      onAdd({
        source: SOURCE,
        styles: STYLES,
      });
    }

    return () => {
      if (SOURCE && STYLES && onRemove) {
        onRemove({
          source: SOURCE,
          styles: STYLES,
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!SOURCE || !STYLES) return null;

  return (
    <Source {...SOURCE}>
      {STYLES.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
      {!STYLES.length && SOURCE.type === 'raster' && <Layer type="raster" beforeId={beforeId} />}
    </Source>
  );
};

export default MapboxLayer;
