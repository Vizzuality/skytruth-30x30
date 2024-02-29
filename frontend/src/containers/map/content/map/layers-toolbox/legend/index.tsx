import { FC, useCallback, useMemo } from 'react';

import { ChevronDown } from 'lucide-react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  useSyncMapLayerSettings,
  useSyncMapLayers,
} from '@/containers/map/content/map/sync-settings';
import { cn } from '@/lib/classnames';
import ArrowDownIcon from '@/styles/icons/arrow-down.svg?sprite';
import ArrowTopIcon from '@/styles/icons/arrow-top.svg?sprite';
import CloseIcon from '@/styles/icons/close.svg?sprite';
import OpacityIcon from '@/styles/icons/opacity.svg?sprite';
import { useGetLayers } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import { LayerTyped } from '@/types/layers';

import LegendItem from './item';

const Legend: FC = () => {
  const [activeLayers, setMapLayers] = useSyncMapLayers();
  const [layerSettings, setLayerSettings] = useSyncMapLayerSettings();

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

  const accordionValue = useMemo(() => {
    // If we don't have layerSettings entries, the view is in its default state; we wish to
    // show all legend accordion items expanded by default.
    const layerSettingsKeys = Object.keys(layerSettings);
    if (!layerSettingsKeys.length) {
      return activeLayers.map((layerId) => layerId.toString());
    }

    // We have layerSettings entries; let's use those to define which accordion items are expanded.
    return layerSettingsKeys.filter((layerId) =>
      layerSettings[layerId].expanded ? layerId.toString() : null
    );
  }, [activeLayers, layerSettings]);

  return (
    <>
      {!layersQuery.data?.length && (
        <p>
          Open <span className="text-sm font-black uppercase">Layers</span> to add layers to the map
        </p>
      )}
      {layersQuery.data?.length > 0 && (
        <Accordion type="multiple" value={accordionValue} onValueChange={onToggleAccordion}>
          {layersQuery.data?.map(({ id, attributes: { title, legend_config } }, index) => {
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
                  'border-t border-black pt-3': index > 0,
                })}
              >
                <div className="flex justify-between gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AccordionTrigger className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 [&_svg]:aria-[expanded=true]:rotate-180">
                          <ChevronDown className="mr-2 inline-block h-4 w-4" aria-hidden />
                          {title}
                        </AccordionTrigger>
                      </TooltipTrigger>
                      <TooltipContent>{title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={isFirst}
                            onClick={() => onMoveLayerUp(id)}
                          >
                            <span className="sr-only">Move up</span>
                            <Icon icon={ArrowTopIcon} className="h-4 w-4 " />
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
                            <Icon icon={ArrowDownIcon} className="h-4 w-4" />
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
                                <Icon icon={OpacityIcon} className="h-4 w-4" />
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
                            {isVisible && <HiEye className="h-4 w-4" aria-hidden />}
                            {!isVisible && <HiEyeOff className="h-4 w-4" aria-hidden />}
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
                            <Icon icon={CloseIcon} className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
                <AccordionContent className="pt-2">
                  <LegendItem config={legend_config as LayerTyped['legend_config']} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
};

export default Legend;
