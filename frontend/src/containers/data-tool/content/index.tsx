import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

import Details from './details';
import Map from './map';

const DataToolContent: React.FC = () => {
  const [{ details }] = useSyncDataToolContentSettings();

  return (
    <div className="relative h-full w-full">
      <Map />
      {details && <Details />}
    </div>
  );
};

export default DataToolContent;
