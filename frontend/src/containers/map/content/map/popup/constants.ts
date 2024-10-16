import { IconProps } from '@/components/ui/icon';
import Mountain from '@/styles/icons/mountain.svg';
import Wave from '@/styles/icons/wave.svg';

export const POPUP_PROPERTIES_BY_SOURCE = {
  'ezz-source': {
    id: 'ISO_SOV1',
    name: {
      en: 'GEONAME',
      es: 'GEONAME_ES',
      fr: 'GEONAME_FR',
    },
  },
  'regions-source': {
    id: 'region_id',
    name: {
      en: 'name',
      es: 'name_es',
      fr: 'name_fr',
    },
  },
  'gadm-countries': {
    id: 'GID_0',
    name: {
      en: 'COUNTRY',
      es: 'name_es',
      fr: 'name_fr',
    },
  },
  'gadm-regions': {
    id: 'region_id',
    name: {
      en: 'name',
      es: 'name_es',
      fr: 'name_fr',
    },
  },
};

export const POPUP_ICON_BY_SOURCE = {
  'ezz-source': Wave as IconProps['icon'],
  'regions-source': Wave as IconProps['icon'],
  'gadm-countries': Mountain as IconProps['icon'],
  'gadm-regions': Mountain as IconProps['icon'],
};
