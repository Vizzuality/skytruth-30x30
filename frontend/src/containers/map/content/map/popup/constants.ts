import { IconProps } from '@/components/ui/icon';
import Mountain from '@/styles/icons/mountain.svg';
import Wave from '@/styles/icons/wave.svg';

export const HOVER_POPUP_PROPERTIES_BY_SOURCE = {
  'ezz-source': {
    en: 'GEONAME',
    es: 'GEONAME_ES',
    fr: 'GEONAME_FR',
  },
  'regions-source': {
    en: 'name',
    es: 'name_es',
    fr: 'name_fr',
  },
  'gadm-countries': {
    en: 'COUNTRY',
    es: 'name_es',
    fr: 'name_fr',
  },
  'gadm-regions': {
    en: 'name',
    es: 'name_es',
    fr: 'name_fr',
  },
};

export const HOVER_POPUP_ICON_BY_SOURCE = {
  'ezz-source': Wave as IconProps['icon'],
  'regions-source': Wave as IconProps['icon'],
  'gadm-countries': Mountain as IconProps['icon'],
  'gadm-regions': Mountain as IconProps['icon'],
};
