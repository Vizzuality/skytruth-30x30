import { DashboardTableItem } from '@/components/dashboard-table';

export const mockedData: DashboardTableItem[] = [
  {
    location: 'United Kingdom',
    locationId: 'GB',
    type: 'country',
    signedInitiative: true,
    score: 0.6,
    ecosystems: ['Mangroves', 'Open ocean', 'Kelp forest'],
    updated: new Date('2023-08-01'),
  },
  {
    location: 'Mexico',
    locationId: 'MX',
    type: 'country',
    signedInitiative: false,
    score: undefined,
    ecosystems: [],
    updated: new Date('2023-07-01'),
  },
  {
    location: 'Spain',
    locationId: 'ES',
    type: 'country',
    signedInitiative: true,
    score: 3.0,
    ecosystems: ['Open ocean'],
    updated: new Date('2022-10-01'),
  },
  {
    location: 'Brazil',
    locationId: 'BR',
    type: 'country',
    signedInitiative: false,
    score: undefined,
    ecosystems: [],
    updated: new Date('2023-01-01'),
  },
  {
    location: 'France',
    locationId: 'FR',
    type: 'country',
    signedInitiative: true,
    score: 12.7,
    ecosystems: ['Mangroves'],
    updated: new Date('2021-12-01'),
  },
  {
    location: 'Netherlands',
    locationId: 'NL',
    type: 'country',
    signedInitiative: true,
    score: 1.6,
    ecosystems: ['Kelp forest', 'Open ocean'],
    updated: new Date('2022-02-01'),
  },
  {
    location: 'Worldwide',
    locationId: 'worldwide',
    type: 'region',
    signedInitiative: true,
    score: 1.6,
    ecosystems: ['Coral reefs', 'Kelp forest', 'Open ocean'],
    updated: new Date('2023-04-01'),
  },
];
