import { useCallback, useEffect, useState } from 'react';

import { Popup } from 'react-map-gl';

import { useAtomValue, useSetAtom } from 'jotai';
import { useKey } from 'rooks';

import Icon from '@/components/ui/icon';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import PopupItem from '@/containers/map/content/map/popup/item';
import { layersInteractiveAtom, popupAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import CloseIcon from '@/styles/icons/close.svg';
import { FCWithMessages } from '@/types';
import { useGetLayers } from '@/types/generated/layer';

import { useSyncMapLayers } from '../sync-settings';

const PopupContainer: FCWithMessages = () => {
  const popup = useAtomValue(popupAtom);
  const layersInteractive = useAtomValue(layersInteractiveAtom);
  const [syncedLayers] = useSyncMapLayers();

  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);

  const setPopup = useSetAtom(popupAtom);

  const availableSources = Array.from(new Set(popup?.features?.map(({ source }) => source)));

  const { data: layersInteractiveData } = useGetLayers(
    {
      filters: {
        id: {
          $in: layersInteractive,
        },
      },
    },
    {
      query: {
        enabled: layersInteractive.length > 1,
        select: ({ data }) =>
          data
            .filter(
              ({
                attributes: {
                  config: {
                    // @ts-expect-error will check later
                    source: { id: sourceId },
                  },
                },
              }) => availableSources?.includes(sourceId)
            )
            .map(({ attributes: { title: label }, id: value }) => ({
              label,
              value: value.toString(),
            }))
            .sort((a, b) =>
              syncedLayers.indexOf(Number(a.value)) > syncedLayers.indexOf(Number(b.value)) ? 1 : -1
            ),
      },
    }
  );

  const closePopup = useCallback(() => {
    setPopup({});
  }, [setPopup]);

  useEffect(() => {
    if (!layersInteractive.length) {
      closePopup();
    }
  }, [layersInteractive, closePopup]);

  useEffect(() => {
    setPopup({});
  }, [layersInteractive, setPopup]);

  useEffect(() => {
    if (layersInteractiveData?.[0]?.value) {
      setSelectedLayerId(Number(layersInteractiveData[0].value));
    }
  }, [layersInteractiveData]);

  useKey('Escape', closePopup);

  const isHoveredTooltip = popup?.type === 'mousemove';
  const isClickedTooltip = popup?.type === 'click';

  if (!Object.keys(popup).length || !popup?.features?.length) return null;

  return (
    <Popup
      latitude={popup.lngLat.lat}
      longitude={popup.lngLat.lng}
      closeOnClick={false}
      closeButton={false}
      maxWidth="300px"
      onClose={closePopup}
      className={cn({
        'min-w-[250px]': !isHoveredTooltip,
      })}
    >
      <div className="space-y-2 p-4">
        {!isHoveredTooltip && (
          <div className="flex justify-end">
            <button onClick={closePopup}>
              <Icon icon={CloseIcon} className="h-3 w-3 fill-black" />
            </button>
          </div>
        )}
        {isClickedTooltip && availableSources.length > 1 && (
          <Select
            onValueChange={(v) => {
              setSelectedLayerId(+v);
            }}
            defaultValue={layersInteractiveData?.[0].value}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layersInteractiveData?.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {isHoveredTooltip && (
          <div className="font-mono text-sm text-gray-500">
            {popup.features.find(({ source }) => source === 'ezz-source')?.properties?.GEONAME}
          </div>
        )}
        {isClickedTooltip && selectedLayerId && <PopupItem id={selectedLayerId} />}
      </div>
    </Popup>
  );
};

PopupContainer.messages = [...PopupItem.messages];

export default PopupContainer;
