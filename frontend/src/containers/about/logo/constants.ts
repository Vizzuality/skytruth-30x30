import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  protectedPlanet: {
    logo: 'protected-planet.png',
    alt: 'Protected Planet',
    link: 'https://www.protectedplanet.net',
    width: 237,
    height: 84,
  },
  marineProtectionAtlas: {
    logo: 'mpa.png',
    alt: 'Marine Protection Atlas',
    link: 'https://mpatlas.org',
    width: 224,
    height: 132,
  },
  protectedSeas: {
    logo: 'protected-seas.png',
    link: 'https://protectedseas.net',
    alt: 'Protected Seas',
    width: 251,
    height: 95,
  },
} satisfies LogosType;
