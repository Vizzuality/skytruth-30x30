import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  team: [
    {
      logo: 'skytruth.png',
      alt: 'SkyTruth logo',
      link: 'https://skytruth.org/',
      description: 'Project Lead',
      dimensions: [110, 75],
    },
    {
      logo: 'vizzuality.png',
      alt: 'Vizzuality logo',
      link: 'https://www.vizzuality.com/',
      description: 'Design & Development',
      dimensions: [186, 47],
    },
    {
      logo: 'cea.png',
      alt: 'CEA Consulting logo',
      link: 'https://www.ceaconsulting.com/',
      description: 'Stakeholder Discovery',
      dimensions: [191, 38],
    },
    {
      logo: 'ocean-advocate.png',
      alt: 'An Ocean Advocate logo',
      link: 'https://www.anoceanadvocate.com/',
      description: 'Data Discovery',
      dimensions: [104, 87],
    },
  ],
  funders: [
    {
      logo: 'bloomberg.png',
      alt: 'Bloomberg Philanthropies Ocean Initiative logo',
      link: 'https://www.bloomberg.org/environment/protecting-the-oceans/bloomberg-ocean/',
      dimensions: [171, 62],
    },
  ],
} satisfies LogosType;
