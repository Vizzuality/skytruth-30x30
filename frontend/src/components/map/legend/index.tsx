import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { ChevronUp, CircleDashed, Eye, EyeOff, MoveUp, X } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { usePreviousDifferent } from 'rooks';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LAYERS } from '@/constants/map';
import { cn } from '@/lib/utils';
import { layersAtom } from '@/store/map';
import { Layer } from '@/types/layer';

import LegendItems from './items';

const Legend: FC = () => {
  const [opened, setOpened] = useState(false);
  const [activeLayers, setActiveLayers] = useRecoilState(layersAtom);
  const previousActiveLayers = usePreviousDifferent(activeLayers);

  const activeLayersDef = useMemo(
    () => activeLayers.map(({ id }) => LAYERS.find((layer) => id === layer.id)).reverse(),
    [activeLayers]
  );

  const onRemoveLayer = useCallback(
    (layerId: Layer['id']) => setActiveLayers(activeLayers.filter(({ id }) => id !== layerId)),
    [activeLayers, setActiveLayers]
  );

  const onToggleLayerVisibility = useCallback(
    (layerId: Layer['id'], isVisible: boolean) => {
      setActiveLayers(
        activeLayers.map((layer) => ({
          ...layer,
          ...(layer.id === layerId
            ? {
                settings: {
                  ...(layer.settings ?? {}),
                  visibility: isVisible,
                },
              }
            : {}),
        }))
      );
    },
    [activeLayers, setActiveLayers]
  );

  const onChangeLayerOpacity = useCallback(
    (layerId: Layer['id'], opacity: number) => {
      setActiveLayers(
        activeLayers.map((layer) => ({
          ...layer,
          ...(layer.id === layerId
            ? {
                settings: {
                  ...(layer.settings ?? {}),
                  opacity,
                },
              }
            : {}),
        }))
      );
    },
    [activeLayers, setActiveLayers]
  );

  const onMoveLayerDown = useCallback(
    (layerId: Layer['id']) => {
      const newActiveLayers = [...activeLayers];
      const layerIndex = newActiveLayers.findIndex(({ id }) => id === layerId);
      if (layerIndex === -1) {
        return;
      }

      const [layer] = newActiveLayers.splice(layerIndex, 1);
      newActiveLayers.splice(layerIndex - 1, 0, layer);

      setActiveLayers(newActiveLayers);
    },
    [activeLayers, setActiveLayers]
  );

  const onMoveLayerUp = useCallback(
    (layerId: Layer['id']) => {
      const newActiveLayers = [...activeLayers];
      const layerIndex = newActiveLayers.findIndex(({ id }) => id === layerId);
      if (layerIndex === -1) {
        return;
      }

      const [layer] = newActiveLayers.splice(layerIndex, 1);
      newActiveLayers.splice(layerIndex + 1, 0, layer);

      setActiveLayers(newActiveLayers);
    },
    [activeLayers, setActiveLayers]
  );

  const onToggleAccordion = useCallback(
    (layerStringIds: string[]) => {
      setActiveLayers(
        activeLayers.map((layer) => ({
          ...layer,
          settings: {
            ...(layer.settings ?? {}),
            expanded: layerStringIds.findIndex((stringId) => stringId === `${layer.id}`) !== -1,
          },
        }))
      );
    },
    [activeLayers, setActiveLayers]
  );

  // When the user adds the first layer, we open the legend automatically
  useEffect(() => {
    if (!previousActiveLayers?.length && activeLayers.length > 0) {
      setOpened(true);
    }
  }, [previousActiveLayers, activeLayers]);

  return (
    <div className="absolute right-3 bottom-8 z-10 font-sans text-base">
      <Collapsible open={opened} onOpenChange={setOpened} className="flex flex-col items-end">
        <CollapsibleTrigger asChild>
          <Button type="button">
            Legend
            <ChevronUp
              className={cn('ml-2 inline-block h-6 w-6', {
                'rotate-180': opened,
              })}
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="max-h-[20vh] w-[calc(100vw_-_24px)] max-w-sm overflow-y-auto bg-white p-5 md:max-h-[50vh] md:max-w-[min(calc(100vw_-_430px_-_40px_-_12px_-_16px),_384px)]">
          {!activeLayersDef.length && (
            <p className="text-center">
              Open <span className="text-sm font-black uppercase">Layers</span> to add layers to the
              map
            </p>
          )}
          {activeLayersDef.length > 0 && (
            <Accordion
              type="multiple"
              value={activeLayers
                .map((activeLayer) =>
                  activeLayer.settings?.expanded === true ? `${activeLayer.id}` : null
                )
                .filter(Number)}
              onValueChange={onToggleAccordion}
            >
              {activeLayersDef.map((layerDef, index) => {
                const isFirst = index === 0;
                const isLast = index + 1 === activeLayersDef.length;
                const isVisible = activeLayers[index].settings?.visibility !== false;
                const opacity = activeLayers[index].settings?.opacity ?? 1;

                return (
                  <AccordionItem
                    key={layerDef.id}
                    value={`${layerDef.id}`}
                    className={cn({
                      'pb-3': index + 1 < activeLayers.length,
                      'border-t border-gray-300 pt-3': index > 0,
                    })}
                  >
                    <div className="flex justify-between gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AccordionTrigger className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                              <ChevronUp
                                className={cn('mr-2 inline-block h-4 w-4', {
                                  'rotate-180': true,
                                })}
                                aria-hidden
                              />
                              {layerDef.name}
                            </AccordionTrigger>
                          </TooltipTrigger>
                          <TooltipContent>{layerDef.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={isFirst}
                                onClick={() => onMoveLayerUp(layerDef.id)}
                              >
                                <span className="sr-only">Move up</span>
                                <MoveUp className="h-4 w-4" aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move up</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={isLast}
                                onClick={() => onMoveLayerDown(layerDef.id)}
                              >
                                <span className="sr-only">Move down</span>
                                <MoveUp className="h-4 w-4 rotate-180" aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move down</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <Popover>
                              <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                  <Button type="button" variant="ghost" size="icon-sm">
                                    <span className="sr-only">Change opacity</span>
                                    <CircleDashed className="h-4 w-4" aria-hidden />
                                  </Button>
                                </PopoverTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Change opacity</TooltipContent>
                              <PopoverContent className="w-48">
                                <Label className="mb-2 block text-xs">Opacity</Label>
                                <Slider
                                  thumbLabel="Opacity"
                                  defaultValue={[opacity]}
                                  max={1}
                                  step={0.1}
                                  onValueCommit={([value]) =>
                                    onChangeLayerOpacity(layerDef.id, value)
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onToggleLayerVisibility(layerDef.id, !isVisible)}
                              >
                                <span className="sr-only">{isVisible ? 'Hide' : 'Show'}</span>
                                {isVisible && <Eye className="h-4 w-4" aria-hidden />}
                                {!isVisible && <EyeOff className="h-4 w-4" aria-hidden />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isVisible ? 'Hide' : 'Show'}</TooltipContent>
                          </Tooltip>
                          <div className="mx-2 h-5 w-px bg-gray-300" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onRemoveLayer(layerDef.id)}
                              >
                                <span className="sr-only">Remove</span>
                                <X className="h-4 w-4" aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </div>
                    <AccordionContent className="pt-2">
                      <LegendItems items={layerDef.legend} />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Legend;
