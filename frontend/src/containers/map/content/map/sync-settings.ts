import { parseAsArrayOf, parseAsInteger, useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

import { CustomMapProps } from '@/components/map/types';
import {
  DEFAULT_SYNC_CONTENT_SETTINGS,
  useSyncMapContentSettings,
} from '@/containers/map/sync-settings';
import { LayerSettings } from '@/types/layers';

const DEFAULT_SYNC_MAP_SETTINGS: {
  bbox: CustomMapProps['initialViewState']['bounds'];
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

// ? there is an issue where NextJS's useSearchParams will not return the update searchParams
// ? updated via next-usequerystate, so we rely in next-usequerystate to retrieve those searchParams as well
// ? this might be an issue with next-usequerystate, but for now we can make it work this way.
// ! if you are using syncing a new state through next-usequerystate in the data-tool's map page, remember to register it here
export const useMapSearchParams = () => {
  const [settings] = useSyncMapSettings();
  const [layers] = useSyncMapLayers();
  const [layerSettings] = useSyncMapLayerSettings();
  const [contentSettings] = useSyncMapContentSettings();
  const currentSearchparams = new URLSearchParams();

  currentSearchparams.set('layers', parseAsArrayOf(parseAsInteger).serialize(layers));
  currentSearchparams.set(
    'settings',
    parseAsJson<typeof DEFAULT_SYNC_MAP_SETTINGS>().serialize(settings)
  );
  currentSearchparams.set(
    'layer-settings',
    parseAsJson<{ [layerId: number]: Partial<LayerSettings> }>().serialize(layerSettings)
  );
  currentSearchparams.set(
    'content',
    parseAsJson<typeof DEFAULT_SYNC_CONTENT_SETTINGS>().serialize(contentSettings)
  );

  return currentSearchparams;
};
