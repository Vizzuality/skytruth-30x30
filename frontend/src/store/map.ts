import { MapLayerMouseEvent } from 'react-map-gl';

import { Feature } from 'geojson';
import { atom } from 'jotai';

import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

// Drawing state
export const drawStateAtom = atom<{ active: boolean; feature: Feature }>({
  active: false,
  feature: null,
});

export const layersInteractiveAtom = atom<LayerResponseDataObject['id'][]>([]);
export const layersInteractiveIdsAtom = atom<string[]>([]);

export const popupAtom = atom<Partial<MapLayerMouseEvent | null>>({});
