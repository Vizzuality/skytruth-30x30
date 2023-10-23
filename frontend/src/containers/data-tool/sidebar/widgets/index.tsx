import { useAtomValue } from 'jotai';

import { locationAtom } from '@/store/location';

import HabitatWidget from './habitat';

const DataToolWidgets: React.FC = () => {
  const location = useAtomValue(locationAtom);

  return (
    <div className="flex flex-col font-mono">
      <HabitatWidget location={location} />
      {/* <HabitatWidget location={location} /> */}
    </div>
  );
};

export default DataToolWidgets;
