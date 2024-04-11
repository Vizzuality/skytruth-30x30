import { atomWithReset } from 'jotai/utils';

import {
  DataToolEcosystem,
  DataToolLanguage,
  DataToolResourceType,
} from 'types/generated/strapi.schemas';

export const cardFiltersAtom = atomWithReset<{
  name: 'name:asc' | 'name:desc' | null;
  resourceType: DataToolResourceType['name'][];
  language: DataToolLanguage['name'][];
  ecosystem: DataToolEcosystem['name'][];
}>({
  name: 'name:asc',
  resourceType: [],
  language: [],
  ecosystem: [],
});
