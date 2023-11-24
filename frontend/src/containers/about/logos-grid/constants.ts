import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  team: [
    {
      logo: 'skytruth.png',
      alt: 'SkyTruth logo',
      link: 'https://skytruth.org/',
      description: 'Project Lead',
      width: 100,
      height: 75,
    },
    {
      logo: 'vizzuality.png',
      alt: 'Vizzuality logo',
      link: 'https://www.vizzuality.com/',
      description: 'Design & Development',
      width: 186,
      height: 47,
    },
    {
      logo: 'cea.png',
      alt: 'CEA Consulting logo',
      link: 'https://www.ceaconsulting.com/',
      description: 'Stakeholder Discovery',
      width: 191,
      height: 38,
    },
    {
      logo: 'ocean-advocate.png',
      alt: 'An Ocean Advocate logo',
      link: 'https://www.anoceanadvocate.com/',
      description: 'Data Discovery',
      width: 104,
      height: 87,
    },
  ],
  funders: [
    {
      logo: 'bloomberg.png',
      alt: 'Bloomberg Philanthropies Ocean Initiative logo',
      link: 'https://www.bloomberg.org/environment/protecting-the-oceans/bloomberg-ocean/',
      width: 171,
      height: 62,
    },
  ],
} satisfies LogosType;
