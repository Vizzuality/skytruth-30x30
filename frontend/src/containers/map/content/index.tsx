import { useSyncDataToolContentSettings } from '@/containers/map/sync-settings';

import Details from './details';
import Map from './map';

const DataToolContent: React.FC = () => {
  const [{ showDetails }] = useSyncDataToolContentSettings();

  return (
    <>
      <Map />
      {showDetails && (
        <div className="relative h-full w-full border-b border-r border-black">
          <Details />
        </div>
      )}
    </>
  );
};

export default DataToolContent;
