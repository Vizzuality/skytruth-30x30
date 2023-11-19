import { LogosType } from './types';

export const LOGOS_PATH = '/images/static-pages/logos/';

export const LOGOS = {
  team: [
    {
      logo: 'skytruth.png',
      alt: 'SkyTruth logo',
      description: 'Project Lead',
      dimensions: [110, 75],
    },
    {
      logo: 'vizzuality.png',
      alt: 'Vizzuality logo',
      description: 'Design & Development Lead',
      dimensions: [186, 47],
    },
    {
      logo: 'cea.png',
      alt: 'CEA Consulting logo',
      description: 'Discovery & Stakeholder Engagement Lead',
      dimensions: [191, 38],
    },
    {
      logo: 'ocean-advocate.png',
      alt: 'An Ocean Advocate logo',
      description: 'Data Discovery & Strategy Lead',
      dimensions: [104, 87],
    },
  ],
  funders: [
    {
      logo: 'bloomberg.png',
      alt: 'Bloomberg Philanthropies Ocean Initiative logo',
      description: 'Project Funder',
      dimensions: [171, 62],
    },
  ],
} satisfies LogosType;
