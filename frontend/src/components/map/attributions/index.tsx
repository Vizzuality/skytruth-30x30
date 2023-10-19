import { FC, useMemo } from 'react';

import { AttributionControl } from 'react-map-gl';

import { LAYERS } from '@/constants/map';
import { useSyncMapSettings } from '@/containers/map/sync-settings';

const Attributions: FC = () => {
  const [{ layers: activeLayers = [] }] = useSyncMapSettings();

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
