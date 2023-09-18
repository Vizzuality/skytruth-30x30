import { FC } from 'react';

import { Layer, Source } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { LAYERS } from '@/constants/map';
import { layersAtom } from '@/store/map';

const LayerManager: FC = () => {
  const layers = useRecoilValue(layersAtom);

  return (
    <>
      {[...layers].reverse().map((layer, index, reverseLayers) => {
        const layerDef = LAYERS.find(({ id }) => id === layer.id);
        if (!layerDef) {
          return null;
        }

        switch (layerDef.type) {
          case 'default':
            return (
              <Source key={layer.id} {...layerDef.config.source}>
                {layerDef.config.layers?.map((subLayer) => {
                  const visibility = layer.settings?.visibility === false ? 'none' : 'visible';
                  const opacity = layer.settings?.opacity ?? 1;

                  let opacityProperties: string[];
                  switch (subLayer.type) {
                    case 'background':
                      opacityProperties = ['background-opacity'];
                      break;
                    case 'circle':
                      opacityProperties = ['circle-opacity', 'circle-stroke-opacity'];
                      break;
                    case 'fill':
                      opacityProperties = ['fill-opacity'];
                      break;
                    case 'fill-extrusion':
                      opacityProperties = ['fill-extrusion-opacity'];
                      break;
                    case 'heatmap':
                      opacityProperties = ['heatmap-opacity'];
                      break;
                    case 'hillshade':
                      break;
                    case 'line':
                      opacityProperties = ['line-opacity'];
                      break;
                    case 'raster':
                      opacityProperties = ['raster-opacity'];
                      break;
                    case 'symbol':
                      opacityProperties = ['icon-opacity', 'text-opacity'];
                      break;
                  }

                  const opacityObj = opacityProperties
                    .map((property) => ({ [property]: opacity }))
                    .reduce((res, obj) => ({ ...res, ...obj }), {});

                  let nextLayerId: string = undefined;
                  if (index > 0) {
                    const nextLayerDef = LAYERS.find(
                      ({ id }) => id === reverseLayers[index - 1].id
                    );
                    if (nextLayerDef?.config.layers?.length > 0) {
                      nextLayerId = nextLayerDef?.config.layers[0].id;
                    }
                  }

                  return (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <Layer
                      key={subLayer.id}
                      beforeId={nextLayerId}
                      {...subLayer}
                      layout={{
                        ...(subLayer.layout ?? {}),
                        visibility,
                      }}
                      paint={{
                        ...(subLayer.paint ?? {}),
                        ...opacityObj,
                      }}
                    />
                  );
                })}
              </Source>
            );
        }
      })}
    </>
  );
};

export default LayerManager;
