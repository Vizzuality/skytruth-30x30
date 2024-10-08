import { ComponentProps, useCallback, useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import TooltipButton from '@/components/tooltip-button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DATASETS } from '@/constants/datasets';
import { useSyncMapSettings } from '@/containers/map/content/map/sync-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { FCWithMessages } from '@/types';
import { useGetDatasets } from '@/types/generated/dataset';
import { DatasetUpdatedByData } from '@/types/generated/strapi.schemas';

import LayersGroup, { SWITCH_LABEL_CLASSES } from './layers-group';

const LayersPanel: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.map-sidebar-layers-panel');
  const locale = useLocale();
  const [{ labels }, setMapSettings] = useSyncMapSettings();
  const [{ tab }] = useSyncMapContentSettings();

  const {
    data: datasetsData,
    isFetching: isFetchingDatasetsData,
  }: { data: DatasetUpdatedByData[]; isFetching: boolean } = useGetDatasets(
    {
      locale,
      sort: 'name:asc',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      populate: {
        layers: {
          populate: 'metadata,environment',
        },
      },
    },
    {
      query: {
        select: ({ data }) => data,
      },
    }
  );

  const datasets = useMemo(() => {
    const basemapDataset = datasetsData?.filter(
      ({ attributes }) => attributes?.slug === DATASETS.basemap
    );
    const basemapDatasetIds = basemapDataset?.map(({ id }) => id);
    const nonBasemapDataset = datasetsData?.filter(({ id }) => !basemapDatasetIds.includes(id));

    const filterLayersByEnvironment = (layers, environment) => {
      const layersData = layers?.data;
      return (
        layersData?.filter(({ attributes }) => {
          const environmentData = attributes?.environment?.data;
          return environmentData?.attributes?.slug === environment;
        }) || []
      );
    };

    const parseDatasetsByEnvironment = (dataset, environment) => {
      const parsedDatasets = nonBasemapDataset?.map((d) => {
        const { layers, ...rest } = d?.attributes;
        const filteredLayers = filterLayersByEnvironment(layers, environment);
        if (!filteredLayers.length) return null;

        return {
          id: dataset?.id,
          attributes: {
            ...rest,
            layers: {
              data: filteredLayers,
            },
          },
        };
      });

      return parsedDatasets?.filter((dataset) => dataset !== null);
    };

    const [terrestrialDataset, marineDataset] = [DATASETS.terrestrial, DATASETS.marine]?.map(
      (environment) => parseDatasetsByEnvironment(nonBasemapDataset, environment)
    );

    return {
      terrestrial: terrestrialDataset,
      marine: marineDataset,
      basemap: basemapDataset,
    };
  }, [datasetsData]);

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
    <div className="h-full overflow-auto px-4 text-xs">
      <div className="py-1">
        <h3 className="text-xl font-extrabold">{t('layers')}</h3>
      </div>
      <LayersGroup
        name={t('terrestrial-data')}
        datasets={datasets.terrestrial}
        isOpen={['terrestrial'].includes(tab)}
        loading={isFetchingDatasetsData}
      />
      <LayersGroup
        name={t('marine-data')}
        datasets={datasets.marine}
        isOpen={['marine'].includes(tab)}
        loading={isFetchingDatasetsData}
      />
      <LayersGroup
        name={t('basemap')}
        datasets={datasets.basemap}
        isOpen={['summary'].includes(tab)}
        loading={isFetchingDatasetsData}
        showDatasetsNames={false}
        showBottomBorder={false}
      >
        {/*
          The labels toggle doesn't come from the basemap dataset and has slightly functionality implemented.
          Not ideal, but given it's a one-off, we'll pass the entry as a child to be displayed alongside the
          other entries, much like in the previous implementation.
        */}
        <li className="flex items-center justify-between">
          <span className="flex gap-2">
            <Switch id="labels-switch" checked={labels} onCheckedChange={handleLabelsChange} />
            <Label htmlFor="labels-switch" className={SWITCH_LABEL_CLASSES}>
              {t('labels')}
            </Label>
          </span>
        </li>
      </LayersGroup>
    </div>
  );
};

LayersPanel.messages = ['containers.map-sidebar-layers-panel', ...TooltipButton.messages];

export default LayersPanel;
