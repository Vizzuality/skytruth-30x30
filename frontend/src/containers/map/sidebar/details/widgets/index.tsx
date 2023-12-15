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

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        queryKey: ['locations', locationCode],
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

  return (
    <div className="flex flex-col divide-y-[1px] divide-black font-mono">
      <MarineConservationWidget location={locationsQuery.data} />
      <ProtectionTypesWidget location={locationsQuery.data} />
      <EstablishmentStagesWidget location={locationsQuery.data} />
      <HabitatWidget location={locationsQuery.data} />
    </div>
  );
};

export default MapWidgets;
