import { LngLatBoundsLike } from 'react-map-gl';

import { parseAsArrayOf, parseAsInteger, useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

import { LayerSettings } from '@/types/layers';

const DEFAULT_SYNC_MAP_SETTINGS: {
  bbox: LngLatBoundsLike;
} = {
  bbox: null,
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

export const useDataToolSearchParams = () => {
  const [settings] = useSyncMapSettings();
  const [layers] = useSyncMapLayers();
  const [layerSettings] = useSyncMapLayerSettings();
  const sp = new URLSearchParams();
  sp.set('settings', parseAsJson<typeof DEFAULT_SYNC_MAP_SETTINGS>().serialize(settings));
  sp.set('layers', parseAsArrayOf(parseAsInteger).serialize(layers));
  sp.set(
    'layer-settings',
    parseAsJson<{ [layerId: number]: Partial<LayerSettings> }>().serialize(layerSettings)
  );

  return sp;
};
