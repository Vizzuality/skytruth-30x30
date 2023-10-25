import { FC, useCallback, useEffect, useState } from 'react';

import { ChevronUp, CircleDashed, Eye, EyeOff, MoveUp, X } from 'lucide-react';
import { usePreviousDifferent } from 'rooks';

import {
  Accordion,
  // AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSyncMapLayerSettings, useSyncMapLayers } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { useGetLayers } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
// import { LayerTyped } from '@/types/layers';

// import LegendItems from './items';

const Legend: FC = () => {
  const [opened, setOpened] = useState(false);
  const [activeLayers, setMapLayers] = useSyncMapLayers();
  const [layerSettings, setLayerSettings] = useSyncMapLayerSettings();

  const previousActiveLayers = usePreviousDifferent(activeLayers);

  const layersQuery = useGetLayers(
    {
      sort: 'title:asc',
    },
    {
      query: {
        select: ({ data }) =>
          data
            .filter(({ id }) => activeLayers.includes(id))
            .sort((a, b) => {
              const indexA = activeLayers.indexOf(a.id);
              const indexB = activeLayers.indexOf(b.id);
              return indexA - indexB;
            }),
        placeholderData: { data: [] },
        queryKey: ['layers', activeLayers],
        keepPreviousData: true,
      },
    }
  );

  const onRemoveLayer = useCallback(
    (layerId: LayerResponseDataObject['id']) =>
      setMapLayers((currentLayers) => {
        return currentLayers.filter((_layerId) => _layerId !== layerId);
      }),
    [setMapLayers]
  );

  const onToggleLayerVisibility = useCallback(
    (layerId: LayerResponseDataObject['id'], isVisible: boolean) => {
      setLayerSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          visibility: isVisible,
        },
      }));
    },
    [setLayerSettings]
  );

  const onChangeLayerOpacity = useCallback(
    (layerId: LayerResponseDataObject['id'], opacity: number) => {
      setLayerSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          opacity,
        },
      }));
    },
    [setLayerSettings]
  );

  const onMoveLayerDown = useCallback(
    (layerId: LayerResponseDataObject['id']) => {
      const layerIndex = activeLayers.findIndex((_layerId) => _layerId === layerId);
      if (layerIndex === -1) {
        return;
      }

      setMapLayers((prev) => {
        return prev.toSpliced(layerIndex, 1).toSpliced(layerIndex + 1, 0, layerId);
      });
    },
    [activeLayers, setMapLayers]
  );

  const onMoveLayerUp = useCallback(
    (layerId: LayerResponseDataObject['id']) => {
      const layerIndex = activeLayers.findIndex((_layerId) => _layerId === layerId);
      if (layerIndex === -1) {
        return;
      }

      setMapLayers((prev) => {
        return prev.toSpliced(layerIndex, 1).toSpliced(layerIndex - 1, 0, layerId);
      });
    },
    [activeLayers, setMapLayers]
  );

  const onToggleAccordion = useCallback(
    (layerStringIds: string[]) => {
      setLayerSettings((prev) => ({
        ...prev,
        ...activeLayers.reduce(
          (acc, layerId) => ({
            ...acc,
            [layerId]: {
              ...prev[layerId],
              expanded: layerStringIds.findIndex((stringId) => stringId === `${layerId}`) !== -1,
            },
          }),
          {}
        ),
      }));
    },
    [activeLayers, setLayerSettings]
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
          {!layersQuery.data.length && (
            <p className="text-center">
              Open <span className="text-sm font-black uppercase">Layers</span> to add layers to the
              map
            </p>
          )}
          {layersQuery.data.length > 0 && (
            <Accordion
              type="multiple"
              value={Object.keys(layerSettings).filter((layerId) => {
                return layerSettings[layerId].expanded ? layerId.toString() : null;
              })}
              onValueChange={onToggleAccordion}
            >
              {layersQuery.data.map(({ id, attributes: { title } }, index) => {
                const isFirst = index === 0;
                const isLast = index + 1 === layersQuery.data.length;

                const isVisible = layerSettings[id]?.visibility !== false;
                const opacity = layerSettings[id]?.opacity ?? 1;

                return (
                  <AccordionItem
                    key={id}
                    value={`${id}`}
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
                              {title}
                            </AccordionTrigger>
                          </TooltipTrigger>
                          <TooltipContent>{title}</TooltipContent>
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
                                onClick={() => onMoveLayerUp(id)}
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
                                onClick={() => onMoveLayerDown(id)}
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
                                  onValueCommit={([value]) => onChangeLayerOpacity(id, value)}
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
                                onClick={() => onToggleLayerVisibility(id, !isVisible)}
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
                                onClick={() => {
                                  onRemoveLayer(id);
                                }}
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
                    {/* <AccordionContent className="pt-2">
                      <LegendItems items={legend_config as LayerTyped['legend_config']} />
                    </AccordionContent> */}
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
