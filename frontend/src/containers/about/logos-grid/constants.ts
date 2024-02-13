import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  team: [
    {
      logo: 'skytruth.png',
      alt: 'SkyTruth logo',
      link: 'https://skytruth.org/',
      description: 'Serves as project lead',
      width: 100,
      height: 75,
    },
    {
      logo: 'vizzuality.png',
      alt: 'Vizzuality logo',
      link: 'https://www.vizzuality.com/',
      description: 'Leads design and development',
      width: 186,
      height: 47,
    },
    {
      logo: 'cea.png',
      alt: 'CEA Consulting logo',
      link: 'https://www.ceaconsulting.com/',
      description: 'Leads user discovery and stakeholder engagement',
      width: 191,
      height: 38,
    },
    {
      logo: 'ocean-advocate.png',
      alt: 'An Ocean Advocate logo',
      link: 'https://www.anoceanadvocate.com/',
      description: 'Leads data discovery and strategy',
      width: 104,
      height: 87,
    },
  ],
  funders: [
    {
      logo: 'bloomberg.png',
      alt: 'Bloomberg Philanthropies Ocean Initiative logo',
      link: 'https://www.bloomberg.org/environment/protecting-the-oceans/bloomberg-ocean/',
      description: 'Provides the funding and support that made this tool a reality',
      width: 384,
      height: 49,
    },
  ],
} satisfies LogosType;
