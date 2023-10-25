import { Popup } from 'react-map-gl';

import { useAtomValue, useSetAtom } from 'jotai';

import PopupItem from '@/containers/map/popup/item';
import { layersInteractiveAtom, popupAtom } from '@/store/map';

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
      style={{
        padding: 0,
      }}
      maxWidth="300px"
      onClose={() => setPopup({})}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-4 w-full bg-gradient-to-b from-white" />
      <div className="max-h-[49vh] space-y-2.5 overflow-y-auto overflow-x-hidden pr-8 text-slate-800 shadow-[0_20px_15px_rgba(0,0,0,0.1)]">
        <div className="divide-y divide-slate-200">
          {lys.map((id) => (
            <PopupItem key={id} id={id} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-full bg-gradient-to-t from-white" />
    </Popup>
  );
};

export default PopupContainer;
