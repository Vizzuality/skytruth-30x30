import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';

import CountriesList from './countries-list';
import DetailsButton from './details-button';
import LocationSelector from './location-selector';
import DetailsWidgets from './widgets';

const SidebarDetails: React.FC = () => {
  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();
  const [{ showDetails }] = useSyncMapContentSettings();

  const { data: locationsData } = useGetLocations({
    filters: {
      code: locationCode,
    },
    populate: 'members',
  });

  const memberCountries = useMemo(() => {
    return locationsData?.data[0]?.attributes?.members?.data?.map(({ attributes }) => ({
      code: attributes?.code,
      name: attributes?.name,
    }));
  }, [locationsData?.data]);

  return (
    <>
      <div className="h-full w-full">
        <div className="sticky border-b border-black bg-orange px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-5xl font-black">{locationsData?.data[0]?.attributes?.name}</h1>
          <LocationSelector className="mt-2" theme="orange" />
          <CountriesList
            className="mt-2"
            bgColorClassName="bg-orange"
            countries={memberCountries}
          />
          <DetailsButton className="mt-4" />
        </div>
        <div
          className={cn({
            'h-[calc(100%-161px)] overflow-y-auto': true,
            'h-full': showDetails,
          })}
        >
          <DetailsWidgets />
        </div>
      </div>
    </>
  );
};

export default SidebarDetails;
