import { useSyncMapContentSettings } from '@/containers/map/sync-settings';

import Details from './details';
import Map from './map';

const MapContent: React.FC = () => {
  const [{ showDetails }] = useSyncMapContentSettings();

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

export default MapContent;
