import { useCallback } from 'react';

import { useParams } from 'next/navigation';

import { useAtom } from 'jotai';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';
import { layersInteractiveAtom, layersInteractiveIdsAtom } from '@/containers/data-tool/store';
import { parseConfig } from '@/lib/json-converter';
import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import { Config, LayerTyped } from '@/types/layers';

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, 'id'>> {
  beforeId: string;
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id, {
    populate: 'metadata',
  });
  const [, setLayersInteractive] = useAtom(layersInteractiveAtom);
  const [, setLayersInteractiveIds] = useAtom(layersInteractiveIdsAtom);
  const { locationCode } = useParams();

  const handleAddMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => Array.from(new Set([...prev, id])));
        setLayersInteractiveIds((prev) => Array.from(new Set([...prev, ...ids])));
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds]
  );

  const handleRemoveMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => prev.filter((i) => i !== id));
        setLayersInteractiveIds((prev) => prev.filter((i) => !ids.includes(i)));
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds]
  );

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes as LayerTyped;

  if (type === 'mapbox') {
    const { config, params_config } = data.data.attributes;

    const c = parseConfig<Config>({
      config,
      params_config,
      settings: {
        ...settings,
        location: locationCode,
      },
    });

    if (!c) return null;

    return (
      <MapboxLayer
        id={`${id}-layer`}
        beforeId={beforeId}
        config={c}
        onAdd={handleAddMapboxLayer}
        onRemove={handleRemoveMapboxLayer}
      />
    );
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      settings,
    });

    return <DeckJsonLayer id={`${id}-layer`} beforeId={beforeId} config={c} />;
  }
};

export default LayerManagerItem;
