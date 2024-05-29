import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';

import LocationSelector from '../../location-selector';

import CountriesList from './countries-list';
import DetailsButton from './details-button';
import DetailsWidgets from './widgets';

const SidebarDetails: React.FC = () => {
  const {
    push,
    query: { locationCode = 'GLOB' },
  } = useRouter();
  const [{ showDetails }] = useSyncMapContentSettings();
  const searchParams = useMapSearchParams();

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

  const handleLocationSelected = (locationCode) => {
    push(`${PAGES.progressTracker}/${locationCode}?${searchParams.toString()}`);
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="sticky border-b border-black bg-orange px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-5xl font-black">{locationsData?.data[0]?.attributes?.name}</h1>
          <LocationSelector className="mt-2" theme="orange" onChange={handleLocationSelected} />
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
