import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';

import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import DetailsButton from './details-button';
import LocationSelector from './location-selector';
import DetailsWidgets from './widgets';

const SidebarDetails: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();
  const queryClient = useQueryClient();
  const [{ showDetails }] = useSyncMapContentSettings();

  const location = queryClient.getQueryData<LocationGroupsDataItemAttributes>([
    'locations',
    locationCode,
  ]);

  return (
    <>
      <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
        <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
          <h1 className="text-5xl font-black">{location?.name}</h1>
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
