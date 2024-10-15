import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { FCWithMessages } from '@/types';

import Details from './details';
import Map from './map';

const MapContent: FCWithMessages = () => {
  const [{ showDetails }] = useSyncMapContentSettings();

  return (
    <>
      <Map />
      {showDetails && (
        <div className="relative h-full w-full overflow-hidden border-b border-r border-black">
          <Details />
        </div>
      )}
    </>
  );
};

MapContent.messages = [...Map.messages, ...Details.messages];

export default MapContent;
