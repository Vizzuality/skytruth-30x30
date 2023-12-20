import { useRouter } from 'next/router';

import { useGetLocations } from '@/types/generated/location';

import EstablishmentStagesWidget from './establishment-stages';
import HabitatWidget from './habitat';
import MarineConservationWidget from './marine-conservation';
import ProtectionTypesWidget from './protection-types';

const MapWidgets: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();

  const { data: locationsData } = useGetLocations({
    filters: {
      code: locationCode,
    },
  });

  return (
    <div className="flex flex-col divide-y-[1px] divide-black font-mono">
      <MarineConservationWidget location={locationsData?.data[0]?.attributes} />
      <ProtectionTypesWidget location={locationsData?.data[0]?.attributes} />
      <EstablishmentStagesWidget location={locationsData?.data[0]?.attributes} />
      <HabitatWidget location={locationsData?.data[0]?.attributes} />
    </div>
  );
};

export default MapWidgets;
