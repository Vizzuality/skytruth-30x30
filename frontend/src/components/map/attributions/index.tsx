import { FC } from 'react';

import { AttributionControl } from 'react-map-gl';

import { useSyncMapLayers } from '@/containers/data-tool/content/map/sync-settings';
import { useGetLayers } from '@/types/generated/layer';

const Attributions: FC = () => {
  const [activeLayers] = useSyncMapLayers();

  const layerQuery = useGetLayers(
    {
      filters: {
        id: {
          $in: activeLayers,
        },
      },
      populate: 'metadata',
    },
    {
      query: {
        enabled: !!activeLayers.length,
        select: ({ data }) =>
          data.map(({ attributes: { metadata } }) => metadata?.source).filter((source) => !!source),
      },
    }
  );

  return (
    <AttributionControl
      key={layerQuery.data?.join('')}
      compact={false}
      customAttribution={layerQuery.data}
    />
  );
};

export default Attributions;
