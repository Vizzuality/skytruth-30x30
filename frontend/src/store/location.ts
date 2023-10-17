import { atom } from 'recoil';

import type Location from '@/types/location';

export const locationAtom = atom<Location>({
  key: 'location',
  default: null,
});
