import { useAtomValue } from 'jotai';

import { locationAtom } from '@/store/location';

import HabitatWidget from './habitat';
import MarineConservationWidget from './marine-conservation';
import ProtectionTypesWidget from './protection-types';

const DataToolWidgets: React.FC = () => {
  const location = useAtomValue(locationAtom);

  return (
    <div className="flex flex-col divide-y-[1px] divide-black font-mono">
      <MarineConservationWidget location={location} />
      <ProtectionTypesWidget location={location} />
      <HabitatWidget location={location} />
    </div>
  );
};

export default DataToolWidgets;
