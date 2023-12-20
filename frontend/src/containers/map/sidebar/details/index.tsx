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
      <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
        <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
          <h1 className="text-5xl font-black">{locationsData.data[0]?.attributes?.name}</h1>
          <LocationSelector className="my-2" />
        </div>
        <DetailsWidgets />
      </div>
      <div
        className={cn('absolute bottom-0 left-px', {
          'right-px': !showDetails,
        })}
      >
        <DetailsButton />
      </div>
    </>
  );
};

export default SidebarDetails;
