import { LngLatBoundsLike } from 'react-map-gl';

import { parseAsArrayOf, parseAsInteger, useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

import { LayerSettings } from '@/types/layers';

const DEFAULT_SYNC_MAP_SETTINGS: {
  bbox: LngLatBoundsLike;
  labels: boolean;
} = {
  bbox: null,
  labels: true,
};

export const useSyncMapSettings = () => {
  return useQueryState(
    'settings',
    parseAsJson<typeof DEFAULT_SYNC_MAP_SETTINGS>().withDefault(DEFAULT_SYNC_MAP_SETTINGS)
  );
};

export const useSyncMapLayers = () => {
  return useQueryState('layers', parseAsArrayOf(parseAsInteger).withDefault([]));
};

export const useSyncMapLayerSettings = () => {
  return useQueryState(
    'layer-settings',
    parseAsJson<{ [layerId: number]: Partial<LayerSettings> }>().withDefault({})
  );
};
