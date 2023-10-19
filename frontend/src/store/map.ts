import { Feature } from 'geojson';
import { atom } from 'jotai';

// Drawing state
export const drawStateAtom = atom<{ active: boolean; feature: Feature }>({
  active: false,
  feature: null,
});
