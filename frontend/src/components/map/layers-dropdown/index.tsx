import { FC, useCallback, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useSyncMapLayers, useSyncMapLayerSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLayers } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

const LayersDropdown: FC<{
  className?: HTMLDivElement['className'];
}> = ({ className }) => {
  const [opened, setOpened] = useState(false);
  const [activeLayers, setMapLayers] = useSyncMapLayers();
  const [, setLayerSettings] = useSyncMapLayerSettings();

  const layersQuery = useGetLayers(
    {
      sort: 'title:asc',
    },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  const onToggleLayer = useCallback(
    (layerId: LayerResponseDataObject['id'], isActive: boolean) => {
      setMapLayers(
        isActive
          ? [...activeLayers, Number(layerId)]
          : activeLayers.filter((_layerId) => _layerId !== Number(layerId))
      );

      setLayerSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          expanded: true,
        },
      }));
    },
    [activeLayers, setLayerSettings, setMapLayers]
  );

  return (
    <div
      className={cn({
        'absolute top-3 left-3 z-10 font-sans text-base': true,
        [className]: Boolean(className),
      })}
    >
      <Popover open={opened} onOpenChange={setOpened}>
        <PopoverTrigger asChild>
          <Button type="button">
            Layers
            <ChevronDown
              className={cn('ml-2 inline-block h-6 w-6', {
                'rotate-180': opened,
              })}
              aria-hidden
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[calc(100vw_-_24px)] max-w-sm">
          <ul className="flex flex-col gap-[26px]">
            {layersQuery.data.map((layer) => {
              const isActive = activeLayers.findIndex((layerId) => layerId === layer.id) !== -1;
              const onCheckedChange = onToggleLayer.bind(null, layer.id) as (
                isActive: boolean
              ) => void;

              return (
                <li key={layer.id} className="flex items-start gap-2">
                  <Switch
                    id={`${layer.id}-switch`}
                    checked={isActive}
                    onCheckedChange={onCheckedChange}
                  />
                  <Label htmlFor={`${layer.id}-switch`} className="cursor-pointer">
                    {layer.attributes.title}
                  </Label>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LayersDropdown;
