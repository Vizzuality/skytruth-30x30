import { atom } from 'jotai';

import type { Location } from '@/types/generated/strapi.schemas';

export const locationAtom = atom<Location>({
  code: undefined,
  name: undefined,
  totalMarineArea: undefined,
  type: undefined,
});
