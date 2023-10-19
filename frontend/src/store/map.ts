import { Feature } from 'geojson';
import { atom } from 'recoil';

// Drawing state
export const drawStateAtom = atom<{ active: boolean; feature: Feature }>({
  key: 'draw-state',
  default: {
    active: false,
    feature: null,
  },
});
