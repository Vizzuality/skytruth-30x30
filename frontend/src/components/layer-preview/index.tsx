import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const MAPBOX_STYLES_ID = 'skytruth/clxk42ahk00as01qq1h4295jj';

const LayerPreview: React.FC<{
  wdpaId: string;
  bounds: [number, number, number, number];
}> = ({ wdpaId, bounds }) => {
  const { data } = useQuery(['layer-preview', wdpaId], {
    queryFn: async () => {
      return axios
        .get(`https://api.mapbox.com/styles/v1/${MAPBOX_STYLES_ID}/static/${bounds}/75x75`, {
          responseType: 'blob',
          params: {
            setfilter: `['==', ['get', 'WDPAID'], ${wdpaId}]`,
            layer_id: 'mpa-intermediate-simp', // ! update this
            access_token: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
            attribution: false,
            logo: false,
            // padding: 'auto',
          },
        })
        .then((response) => response.data);
    },
    enabled: !!wdpaId,
  });

  const srcImage = data ? URL.createObjectURL(data) : null;

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
