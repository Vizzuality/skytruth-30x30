import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

import Details from './details';
import Map from './map';

const DataToolContent: React.FC = () => {
  const [{ showDetails }] = useSyncDataToolContentSettings();

  return (
    <>
      <Map />
      {showDetails && (
        <div className="relative h-full w-full">
          <Details />
        </div>
      )}
    </>
  );
};

export default DataToolContent;
