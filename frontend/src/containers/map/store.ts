import { MapLayerMouseEvent } from 'react-map-gl';

import { Feature } from 'geojson';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { CustomMapProps } from '@/components/map/types';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import type { ModellingData } from '@/types/modelling';

export const sidebarAtom = atom(true);

// ? Map state
export const layersInteractiveAtom = atom<LayerResponseDataObject['id'][]>([]);
export const layersInteractiveIdsAtom = atom<string[]>([]);
export const bboxLocation = atom<CustomMapProps['bounds']['bbox'] | null>(null);
export const popupAtom = atom<Partial<MapLayerMouseEvent | null>>({});
export const drawStateAtom = atomWithReset<{
  active: boolean;
  status: 'idle' | 'drawing' | 'success';
  feature: Feature;
}>({
  active: false,
  status: 'idle',
  feature: null,
});

// ? modelling state
export const modellingAtom = atomWithReset<{
  active: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  data: ModellingData;
}>({
  active: false,
  status: 'idle',
  data: null,
});
