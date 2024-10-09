import { ComponentProps, useCallback, useEffect, useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import TooltipButton from '@/components/tooltip-button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ENVIRONMENTS } from '@/constants/environments';
import { useSyncMapLayers, useSyncMapSettings } from '@/containers/map/content/map/sync-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { FCWithMessages } from '@/types';
import { useGetDatasets } from '@/types/generated/dataset';
import { DatasetUpdatedByData } from '@/types/generated/strapi.schemas';

import LayersGroup, { SWITCH_LABEL_CLASSES } from './layers-group';

const LayersPanel: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.map-sidebar-layers-panel');
  const locale = useLocale();
  const [, setMapLayers] = useSyncMapLayers();
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

  // Break up datasets by terrestrial, marine, basemap for ease of handling
  const datasets = useMemo(() => {
    // Basemap dataset is displayed separately in the panel, much like terrestrial/maritime.
    // We need to split it out from the datasets we're processing in order to display this correctly.
    const basemapDataset = datasetsData?.filter(({ attributes }) => attributes?.slug === 'basemap');
    const basemapDatasetIds = basemapDataset?.map(({ id }) => id);
    const nonBasemapDatasets = datasetsData?.filter(({ id }) => !basemapDatasetIds.includes(id));

    // A dataset can contain layers with different environments assigned, we want
    // to pick only the layers for the environment we're displaying.
    const filterLayersByEnvironment = (layers, environment) => {
      const layersData = layers?.data;

      return (
        layersData?.filter(({ attributes }) => {
          const environmentData = attributes?.environment?.data;
          return environmentData?.attributes?.slug === environment;
        }) || []
      );
    };

    const parseDatasetsByEnvironment = (datasets, environment) => {
      const parsedDatasets = datasets?.map((d) => {
        const { layers, ...rest } = d?.attributes;
        const filteredLayers = filterLayersByEnvironment(layers, environment);

        // If dataset contains no layers, it should not displayed. We'll filter this
        // values before the return of the parsed data array.
        if (!filteredLayers.length) return null;

        return {
          id: d?.id,
          attributes: {
            ...rest,
            layers: {
              data: filteredLayers,
            },
          },
        };
      });

      // Prevent displaying of groups when they are empty / contain no layers
      return parsedDatasets?.filter((dataset) => dataset !== null);
    };

    const [terrestrialDataset, marineDataset] = [
      ENVIRONMENTS.terrestrial,
      ENVIRONMENTS.marine,
    ]?.map((environment) => parseDatasetsByEnvironment(nonBasemapDatasets, environment));

    return {
      terrestrial: terrestrialDataset,
      marine: marineDataset,
      basemap: basemapDataset,
    };
  }, [datasetsData]);

  // Default layers ids by dataset type
  const defaultLayersIds = useMemo(() => {
    const datasetsDefaultLayerIds = (datasets = []) => {
      return datasets.reduce((acc, { attributes }) => {
        const layersData = attributes?.layers?.data;
        const defaultLayersIds = layersData.reduce(
          (acc, { id, attributes }) => (attributes?.default ? [...acc, id] : acc),
          []
        );
        return [...acc, ...defaultLayersIds];
      }, []);
    };

    return {
      terrestrial: datasetsDefaultLayerIds(datasets.terrestrial),
      marine: datasetsDefaultLayerIds(datasets.marine),
      basemap: datasetsDefaultLayerIds(datasets.basemap),
    };
  }, [datasets]);

  // Set map layers to the corresponding defaults when the user switches tabs
  useEffect(() => {
    let mapLayers = [];
    switch (tab) {
      case 'summary':
        mapLayers = ['terrestrial', 'marine', 'basemap']?.reduce(
          (ids, dataset) => [...ids, ...defaultLayersIds[dataset]],
          []
        );
        break;
      case 'terrestrial':
        mapLayers = defaultLayersIds.terrestrial;
        break;
      case 'marine':
        mapLayers = defaultLayersIds.marine;
        break;
    }
    setMapLayers(mapLayers);
  }, [defaultLayersIds, setMapLayers, tab]);

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
        isOpen={['summary', 'terrestrial'].includes(tab)}
        loading={isFetchingDatasetsData}
      />
      <LayersGroup
        name={t('marine-data')}
        datasets={datasets.marine}
        isOpen={['summary', 'marine'].includes(tab)}
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
        <li className="flex items-start justify-between">
          <span className="flex items-start gap-2">
            <Switch
              id="labels-switch"
              className="mt-px"
              checked={labels}
              onCheckedChange={handleLabelsChange}
            />
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
