import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

import Details from './details';
import Map from './map';

const DataToolContent: React.FC = () => {
  const [{ showDetails }] = useSyncDataToolContentSettings();

  return (
    <div className="absolute h-full w-full">
      <Map />
      {showDetails && <Details />}
    </div>
  );
};

export default DataToolContent;
