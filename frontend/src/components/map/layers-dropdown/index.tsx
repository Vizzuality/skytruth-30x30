import { FC, useCallback, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { LAYERS } from '@/constants/map';
import { useSyncMapSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/utils';
import { Layer } from '@/types/layer';

const layers = [...LAYERS].sort((layerA, layerB) => layerA.name.localeCompare(layerB.name));

const LayersDropdown: FC = () => {
  const [opened, setOpened] = useState(false);
  const [{ layers: activeLayers = [] }, setMapSettings] = useSyncMapSettings();

  const onToggleLayer = useCallback(
    (layerId: Layer['id'], isActive: boolean) =>
      setMapSettings((prev) => ({
        ...prev,
        layers: isActive
          ? [...activeLayers, { id: layerId, settings: { expanded: true } }]
          : activeLayers.filter(({ id }) => id !== layerId),
      })),
    [activeLayers, setMapSettings]
  );

  return (
    <div className="absolute top-3 left-3 z-10 font-sans text-base">
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
            {layers.map((layer) => {
              const isActive = activeLayers.findIndex(({ id }) => id === layer.id) !== -1;
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
                    {layer.name}
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
