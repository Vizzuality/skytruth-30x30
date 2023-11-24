import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  protectedPlanet: {
    logo: 'protected-planet.png',
    alt: 'Protected Planet logo',
    width: 237,
    height: 84,
  },
  marineProtectionAtlas: {
    logo: 'mpa.png',
    alt: 'Marine Protection Atlas logo',
    width: 224,
    height: 132,
  },
  protectedSeas: {
    logo: 'protected-seas.png',
    alt: 'Protected Seas logo',
    width: 251,
    height: 95,
  },
} satisfies LogosType;
