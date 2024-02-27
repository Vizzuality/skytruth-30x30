import { ComponentProps, useCallback } from 'react';

import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

import TooltipButton from '@/components/tooltip-button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useSyncMapLayers,
  useSyncMapLayerSettings,
  useSyncMapSettings,
} from '@/containers/map/content/map/sync-settings';
import { useGetLayers } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

const COLLAPSIBLE_TRIGGER_CLASSES =
  'group flex w-full items-center justify-between font-mono font-bold uppercase text-black data-[state=open]:border-b data-[state=open]:border-dashed data-[state=open]:border-black/20 data-[state=open]:pb-2 leading-none';
const TABS_ICONS_CLASSES = 'w-5 h-5 -translate-y-[2px]';

const LayersDropdown = (): JSX.Element => {
  const [activeLayers, setMapLayers] = useSyncMapLayers();
  const [layerSettings, setLayerSettings] = useSyncMapLayerSettings();
  const [{ labels }, setMapSettings] = useSyncMapSettings();

  const layersQuery = useGetLayers(
    {
      sort: 'title:asc',
      populate: 'metadata',
    },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
        keepPreviousData: true,
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

      // If we don't have layerSettings entries, the view is in its default state; we wish to
      // show all legend accordion items expanded by default.
      const initialSettings = (() => {
        const layerSettingsKeys = Object.keys(layerSettings);
        if (layerSettingsKeys.length) return {};
        return Object.assign(
          {},
          ...activeLayers.map((layerId) => ({ [layerId]: { expanded: true } }))
        );
      })();

      setLayerSettings((prev) => ({
        ...initialSettings,
        ...prev,
        [layerId]: {
          ...prev[layerId],
          expanded: true,
        },
      }));
    },
    [activeLayers, layerSettings, setLayerSettings, setMapLayers]
  );

  const handleLabelsChange = useCallback(
    (active: Parameters<ComponentProps<typeof Switch>['onCheckedChange']>[0]) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: active,
      }));
    },
    [setMapSettings]
  );

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen={Boolean(activeLayers.length)}>
        <CollapsibleTrigger className={COLLAPSIBLE_TRIGGER_CLASSES}>
          <span>Data Layers</span>
          <LuChevronDown className={`hidden group-data-[state=open]:block ${TABS_ICONS_CLASSES}`} />
          <LuChevronUp className={`hidden group-data-[state=closed]:block ${TABS_ICONS_CLASSES}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-b border-dashed border-black/20">
          <ul className="my-3 flex flex-col space-y-5">
            {layersQuery.data?.map((layer) => {
              const isActive = activeLayers.findIndex((layerId) => layerId === layer.id) !== -1;
              const onCheckedChange = onToggleLayer.bind(null, layer.id) as (
                isActive: boolean
              ) => void;
              const metadata = layer?.attributes?.metadata;

              return (
                <li key={layer.id} className="flex items-center">
                  <span className="flex gap-2">
                    <Switch
                      id={`${layer.id}-switch`}
                      checked={isActive}
                      onCheckedChange={onCheckedChange}
                    />
                    <Label htmlFor={`${layer.id}-switch`} className="cursor-pointer">
                      {layer.attributes.title}
                    </Label>
                  </span>
                  {metadata?.description && (
                    <TooltipButton className="-my-1" text={metadata?.description} />
                  )}
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen={labels}>
        <CollapsibleTrigger
          className={`${COLLAPSIBLE_TRIGGER_CLASSES} pb-0 data-[state=open]:pb-2`}
        >
          <span>basemap Layers</span>
          <LuChevronDown className={`hidden group-data-[state=open]:block ${TABS_ICONS_CLASSES}`} />
          <LuChevronUp className={`hidden group-data-[state=closed]:block ${TABS_ICONS_CLASSES}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="my-3 flex flex-col space-y-5 overflow-y-hidden">
            <li className="flex items-start gap-2">
              <Switch id="labels-switch" checked={labels} onCheckedChange={handleLabelsChange} />
              <Label htmlFor="labels-switch" className="cursor-pointer">
                Labels
              </Label>
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default LayersDropdown;
