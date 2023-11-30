import { MapLayerMouseEvent } from 'react-map-gl';

import { Feature } from 'geojson';
import { atom } from 'jotai';

import { CustomMapProps } from '@/components/map/types';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

export const sidebarAtom = atom(true);

// ? Map state
export const layersInteractiveAtom = atom<LayerResponseDataObject['id'][]>([]);
export const layersInteractiveIdsAtom = atom<string[]>([]);
export const bboxLocation = atom<CustomMapProps['bounds']['bbox'] | null>(null);
export const popupAtom = atom<Partial<MapLayerMouseEvent | null>>({});
export const drawStateAtom = atom<{ active: boolean; feature: Feature }>({
  active: false,
  feature: null,
});
