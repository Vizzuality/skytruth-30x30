import { LngLatBoundsLike } from 'react-map-gl';

import { useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

import { Layer, LayerSettings } from '@/types/layer';

const DEFAULT_SYNC_MAP_SETTINGS: {
  bbox: LngLatBoundsLike;
  layers: readonly { id: Layer['id']; settings?: LayerSettings }[];
} = {
  bbox: null,
  layers: [],
};

export const useSyncMapSettings = () => {
  return useQueryState(
    'settings',
    parseAsJson<typeof DEFAULT_SYNC_MAP_SETTINGS>().withDefault(DEFAULT_SYNC_MAP_SETTINGS)
  );
};
