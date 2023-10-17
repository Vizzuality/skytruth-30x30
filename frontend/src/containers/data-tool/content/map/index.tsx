import { Layer, Source } from 'react-map-gl/maplibre';

import LayerManager from '@/components/layer-manager';
import Map, { ZoomControls, LayersDropdown, Legend, Attributions } from '@/components/map';

const DataToolMap: React.FC = () => {
  return (
    <Map>
      {() => (
        <>
          <div>
            <LayersDropdown />
            <Legend />
          </div>
          <ZoomControls />
          <Source
            id="basemap"
            type="raster"
            tiles={['https://tile.openstreetmap.org/{z}/{x}/{y}.png']}
            attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
            maxzoom={20}
            tileSize={256}
          >
            <Layer id="basemap" type="raster" />
          </Source>
          <LayerManager />
          <Attributions />
        </>
      )}
    </Map>
  );
};

export default DataToolMap;
