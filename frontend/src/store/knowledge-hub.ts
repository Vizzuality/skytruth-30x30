import { atomWithReset } from 'jotai/utils';

import {
  DataToolEcosystem,
  DataToolLanguage,
  DataToolResourceType,
} from 'types/generated/strapi.schemas';

export const cardFiltersAtom = atomWithReset<{
  name: 'name:asc' | 'name:desc' | null;
  language: DataToolLanguage['name'] | null;
  resourceType: DataToolResourceType['name'] | null;
  ecosystem: DataToolEcosystem['name'] | null;
}>({
  name: 'name:asc',
  language: null,
  resourceType: null,
  ecosystem: null,
});
