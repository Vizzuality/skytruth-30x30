import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useEffect, useMemo } from 'react';

import { Minus, Plus } from 'lucide-react';
import type { Map as MapLibreType } from 'maplibre-gl';
import MapLibreMap, { Layer, Source } from 'react-map-gl/maplibre';

const Map: React.FC = () => {
  const [map, setMap] = useState<MapLibreType | null>(null);
  const [zoom, setZoom] = useState(1);

  const minZoom = useMemo(() => (map ? map.getMinZoom() : 0), [map]);
  const maxZoom = useMemo(() => (map ? map.getMaxZoom() : 0), [map]);

  useEffect(() => {
    if (map) {
      // Disable the map's rotation
      map.dragRotate.disable();
      map.touchZoomRotate.disable();

      setZoom(map.getZoom());
    }
  }, [map]);

  return (
    <MapLibreMap
      style={{ width: '100%', height: '100%' }}
      onLoad={(e) => {
        setMap(e.target);
      }}
      maxPitch={0}
      initialViewState={{
        zoom,
      }}
      minZoom={0}
      maxZoom={22}
      onZoomEnd={() => setZoom(map.getZoom())}
    >
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
      <div className="absolute top-6 right-6 z-10 flex flex-col">
        <button
          type="button"
          className="block rounded-lg rounded-b-none bg-black p-1 text-white ring-offset-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          disabled={zoom === maxZoom}
          onClick={() =>
            map.zoomTo(Math.round(Math.min(map.getZoom() + 1, maxZoom)), { duration: 250 })
          }
        >
          <Plus className="h-6 w-6" aria-hidden />
          <span className="sr-only">Zoom in</span>
        </button>
        <button
          type="button"
          className="block rounded-lg rounded-t-none bg-black p-1 text-white ring-offset-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          onClick={() =>
            map.zoomTo(Math.round(Math.max(map.getZoom() - 1, minZoom)), { duration: 250 })
          }
          disabled={zoom === minZoom}
        >
          <Minus className="h-6 w-6" aria-hidden />
          <span className="sr-only">Zoom out</span>
        </button>
      </div>
    </MapLibreMap>
  );
};

export default Map;
