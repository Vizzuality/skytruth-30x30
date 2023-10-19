import { atom } from 'recoil';

import type { Location } from '@/types/generated/strapi.schemas';

export const locationAtom = atom<Location>({
  key: 'location',
  default: null,
});
