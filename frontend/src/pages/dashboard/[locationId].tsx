import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Check, ChevronDown } from 'lucide-react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import DashboardTable, { DashboardTableItem } from '@/components/dashboard-table';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DefaultLayout from '@/layouts/default';
import { cn } from '@/lib/classnames';
import { getLocations, useGetLocations } from '@/types/generated/location';
import { LocationListResponseDataItem } from '@/types/generated/strapi.schemas';

const tableData: DashboardTableItem[] = [
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

export const getStaticPaths: GetStaticPaths = async () => {
  const locations = await getLocations({
    'pagination[limit]': -1,
  });

  return {
    paths: locations.data?.map(({ attributes: { code } }) => ({ params: { locationId: code } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ location: LocationListResponseDataItem }> = async ({
  params: { locationId },
}) => {
  const location = await getLocations({
    filters: {
      code: locationId,
    },
  });

  return {
    props: {
      location: location?.data?.[0],
    },
  };
};

const DashboardPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ location }) => {
  const router = useRouter();
  const {
    query: { locationId },
  } = router;

  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  const locationsQuery = useGetLocations(
    {
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) =>
          data.map(({ attributes: { name: label, code: value, type } }) => ({
            label,
            value,
            type,
          })),
      },
    }
  );

  return (
    <DefaultLayout title={`${location?.attributes.name} Dashboard`}>
      <div className="mt-6">
        {locationId !== 'worldwide' && (
          <Link
            href="/dashboard/worldwide"
            className="mb-3 block w-fit bg-black p-2 text-xs font-bold text-white underline ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Worldwide
          </Link>
        )}
        <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
          <PopoverTrigger className="ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
            <h1
              className={cn('flex items-center text-left text-4xl font-black uppercase', {
                'md:text-6xl': locationId === 'worldwide',
              })}
            >
              {location?.attributes.name}
              <ChevronDown className="ml-2 h-10 w-10" />
            </h1>
          </PopoverTrigger>
          <PopoverContent className="w-96 max-w-screen" align="start">
            <Command label="Search country or region">
              <CommandInput placeholder="Search country or region" />
              <CommandEmpty>No result</CommandEmpty>
              <CommandGroup className="mt-4 max-h-64 overflow-y-scroll">
                {locationsQuery.data?.map(({ label, value, type }) => (
                  <CommandItem
                    key={value}
                    value={label}
                    onSelect={() => {
                      void router.replace(`/dashboard/${value}`);
                      setLocationPopoverOpen(false);
                    }}
                  >
                    <div className="flex w-full justify-between gap-x-4">
                      <div className="flex font-bold underline">
                        <Check
                          className={cn(
                            'relative top-1 mr-2 inline-block h-4 w-4 flex-shrink-0',
                            locationId === value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {label}
                      </div>
                      <span className="flex-shrink-0 capitalize text-gray-400">{type}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="mt-3 text-xs text-gray-500">Status last updated: August 2023</p>
        {locationId === 'worldwide' && (
          <div className="mt-8">
            <DashboardTable data={tableData} />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DashboardPage;
