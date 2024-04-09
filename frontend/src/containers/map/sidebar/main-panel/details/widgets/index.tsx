import { useRouter } from 'next/router';

import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';

// import EstablishmentStagesWidget from './establishment-stages';
import FishingProtectionWidget from './fishing-protection';
import HabitatWidget from './habitat';
import MarineConservationWidget from './marine-conservation';
import ProtectionTypesWidget from './protection-types';

const DetailsWidgets: React.FC = () => {
  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();

  const [{ showDetails }] = useSyncMapContentSettings();

  const { data: locationsData } = useGetLocations({
    filters: {
      code: locationCode,
    },
  });

  return (
    <div
      className={cn({
        'flex flex-col divide-y-[1px] divide-black font-mono': true,
        'pb-40': showDetails,
      })}
    >
      <MarineConservationWidget location={locationsData?.data[0]?.attributes} />
      <ProtectionTypesWidget location={locationsData?.data[0]?.attributes} />
      <FishingProtectionWidget location={locationsData?.data[0]?.attributes} />
      {/* <EstablishmentStagesWidget location={locationsData?.data[0]?.attributes} /> */}
      <HabitatWidget location={locationsData?.data[0]?.attributes} />
    </div>
  );
};

export default DetailsWidgets;
