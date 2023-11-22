import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';

import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import HabitatWidget from './habitat';
import MarineConservationWidget from './marine-conservation';
import ProtectionTypesWidget from './protection-types';

const DataToolWidgets: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();

  const queryClient = useQueryClient();

  const location = queryClient.getQueryData<LocationGroupsDataItemAttributes>([
    'locations',
    locationCode,
  ]);

  return (
    <div className="flex flex-col divide-y-[1px] divide-black font-mono">
      <MarineConservationWidget location={location} />
      <ProtectionTypesWidget location={location} />
      <HabitatWidget location={location} />
    </div>
  );
};

export default DataToolWidgets;
