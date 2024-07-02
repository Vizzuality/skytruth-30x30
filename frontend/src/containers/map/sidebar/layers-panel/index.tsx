import { ComponentProps, useCallback } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import TooltipButton from '@/components/tooltip-button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useSyncMapLayers,
  useSyncMapLayerSettings,
  useSyncMapSettings,
} from '@/containers/map/content/map/sync-settings';
import { FCWithMessages } from '@/types';
import { useGetDatasets } from '@/types/generated/dataset';
import { DatasetUpdatedByData, LayerResponseDataObject } from '@/types/generated/strapi.schemas';

const SWITCH_LABEL_CLASSES = '-mb-px cursor-pointer pt-px font-mono text-xs font-normal';

const LayersPanel: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.map-sidebar-layers-panel');
  const locale = useLocale();

  const [activeLayers, setMapLayers] = useSyncMapLayers();
  const [layerSettings, setLayerSettings] = useSyncMapLayerSettings();
  const [{ labels }, setMapSettings] = useSyncMapSettings();

  const { data: datasets }: { data: DatasetUpdatedByData[] } = useGetDatasets(
    {
      locale,
      sort: 'name:asc',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        layers: {
          populate: 'metadata',
        },
      },
    },
    {
      query: {
        select: ({ data }) => data,
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
    <div className="h-full space-y-3 overflow-auto p-4 text-xs">
      <h3 className="text-xl font-bold">{t('layers')}</h3>
      <div className="space-y-3 divide-y divide-dashed divide-black">
        {datasets?.map((dataset) => {
          return (
            <div key={dataset.id} className="[&:not(:first-child)]:pt-3">
              <h4 className="font-bold">{dataset?.attributes?.name}</h4>
              <ul className="my-3 flex flex-col space-y-4">
                {dataset.attributes?.layers?.data?.map((layer) => {
                  const isActive = activeLayers.findIndex((layerId) => layerId === layer.id) !== -1;
                  const onCheckedChange = onToggleLayer.bind(null, layer.id) as (
                    isActive: boolean
                  ) => void;
                  const metadata = layer?.attributes?.metadata;

                  return (
                    <li key={layer.id} className="flex items-center justify-between">
                      <span className="flex gap-2">
                        <Switch
                          id={`${layer.id}-switch`}
                          checked={isActive}
                          onCheckedChange={onCheckedChange}
                        />
                        <Label htmlFor={`${layer.id}-switch`} className={SWITCH_LABEL_CLASSES}>
                          {layer.attributes.title}
                        </Label>
                      </span>
                      {metadata?.description && (
                        <TooltipButton className="-my-1" text={metadata?.description} />
                      )}
                    </li>
                  );
                })}

                <>
                  {dataset.attributes?.name === 'Basemap' && (
                    <li className="flex items-center justify-between">
                      <span className="flex gap-2">
                        <Switch
                          id="labels-switch"
                          checked={labels}
                          onCheckedChange={handleLabelsChange}
                        />
                        <Label htmlFor="labels-switch" className={SWITCH_LABEL_CLASSES}>
                          {t('labels')}
                        </Label>
                      </span>
                    </li>
                  )}
                </>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

LayersPanel.messages = ['containers.map-sidebar-layers-panel', ...TooltipButton.messages];

export default LayersPanel;
