import { Popup } from 'react-map-gl';

import { useAtomValue, useSetAtom } from 'jotai';

import PopupItem from '@/containers/data-tool/content/map/popup/item';
import { layersInteractiveAtom, popupAtom } from '@/containers/data-tool/store';

const PopupContainer = () => {
  const popup = useAtomValue(popupAtom);
  const layersInteractive = useAtomValue(layersInteractiveAtom);
  const lys = [...layersInteractive].reverse();

  const setPopup = useSetAtom(popupAtom);

  if (!Object.keys(popup).length) return null;

  return (
    <Popup
      latitude={popup.lngLat.lat}
      longitude={popup.lngLat.lng}
      closeOnClick={false}
      closeButton={false}
      style={{
        padding: 0,
      }}
      maxWidth="300px"
      onClose={() => setPopup({})}
    >
      <div className="">
        {lys.map((id) => (
          <PopupItem key={id} id={id} />
        ))}
      </div>
    </Popup>
  );
};

export default PopupContainer;
