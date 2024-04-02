import { useRouter } from 'next/router';

import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';

import DetailsButton from './details-button';
import LocationSelector from './location-selector';
import DetailsWidgets from './widgets';

const SidebarDetails: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();
  const [{ showDetails }] = useSyncMapContentSettings();

  const { data: locationsData } = useGetLocations({
    filters: {
      code: locationCode,
    },
  });

  return (
    <>
      <div className="h-full w-full">
        <div className="sticky border-b border-black bg-orange px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-5xl font-black">{locationsData.data[0]?.attributes?.name}</h1>
          <LocationSelector className="mt-2" />
          <DetailsButton className="mt-2" />
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
