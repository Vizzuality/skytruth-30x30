import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  protectedPlanet: {
    logo: 'protected-planet.png',
    alt: 'Protected Planet logo',
    dimensions: [237, 84],
  },
  marineProtectionAtlas: {
    logo: 'mpa.png',
    alt: 'Marine Protection Atlas logo',
    dimensions: [224, 132],
  },
  protectedSeas: {
    logo: 'protected-seas.png',
    alt: 'Protected Seas logo',
    dimensions: [251, 95],
  },
} satisfies LogosType;
