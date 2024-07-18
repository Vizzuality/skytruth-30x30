import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const configs = {
  mpatlas: {
    layerId: 'mpa-intermediate-simp',
    filter: (wdpaId) => `['==', ['get', 'wdpa_id'], ${wdpaId}]`,
    styles: 'skytruth/clxk6ci5q00c401qr5jtsgvue',
  },
  'protected-planet': {
    layerId: 'mpaatlas-intermediate',
    filter: (wdpaId) => `['==', ['get', 'WDPAID'], ${wdpaId}]`,
    styles: 'skytruth/clxk42ahk00as01qq1h4295jj',
  },
};

const PREVIEW_DIMENSIONS = '125x125';

const LayerPreview: React.FC<{
  wdpaId: string;
  bounds: [number, number, number, number];
  dataSource: 'mpatlas' | 'protected-planet';
}> = ({ wdpaId, bounds, dataSource }) => {
  const sourceConfig = configs[dataSource];

  if (!sourceConfig) {
    throw new Error(`Invalid dataSource: ${dataSource}`);
  }

  const point = [bounds[0] + (bounds[2] - bounds[0]), bounds[1] + (bounds[3] - bounds[1])];

  const { data: dataBounds, isError } = useQuery(['layer-preview-bounds', wdpaId], {
    queryFn: async () => {
      return axios
        .get(
          `https://api.mapbox.com/styles/v1/${sourceConfig.styles}/static/${bounds}/${PREVIEW_DIMENSIONS}`,
          {
            responseType: 'blob',
            params: {
              setfilter: sourceConfig.filter(wdpaId),
              layer_id: sourceConfig.layerId,
              access_token: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
              attribution: false,
              logo: false,
            },
          }
        )
        .then((response) => response.data);
    },
    enabled: !!wdpaId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: dataPoint } = useQuery(['layer-preview-point', wdpaId], {
    queryFn: async () => {
      return axios
        .get(
          `https://api.mapbox.com/styles/v1/${sourceConfig.styles}/static/${point[0]},${point[1]},10/${PREVIEW_DIMENSIONS}`,
          {
            responseType: 'blob',
            params: {
              setfilter: sourceConfig.filter(wdpaId),
              layer_id: sourceConfig.layerId,
              access_token: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
              attribution: false,
              logo: false,
            },
          }
        )
        .then((response) => response.data);
    },
    enabled: isError,
    refetchOnWindowFocus: false,
  });

  const srcImage = dataBounds || dataPoint ? URL.createObjectURL(dataPoint || dataBounds) : null;

  return (
    <div
      className="absolute top-0 left-0 h-full w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${srcImage})`,
      }}
    ></div>
  );
};

export default LayerPreview;
