import { FC, useCallback } from 'react';

import { ChevronDown } from 'lucide-react';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { LAYERS } from '@/constants/map';
import { layersAtom } from '@/store/map';
import { Layer } from '@/types/layer';

const layers = [...LAYERS].sort((layerA, layerB) => layerA.name.localeCompare(layerB.name));

const LayersDropdown: FC = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(layersAtom);

  const onToggleLayer = useCallback(
    (layerId: Layer['id'], isActive: boolean) =>
      setActiveLayers(
        isActive
          ? [...activeLayers, { id: layerId }]
          : activeLayers.filter(({ id }) => id !== layerId)
      ),
    [activeLayers, setActiveLayers]
  );

  return (
    <div className="absolute top-3 left-3 z-10 font-sans text-base">
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">
            Layers
            <ChevronDown className="ml-2 inline-block h-6 w-6" aria-hidden />
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
