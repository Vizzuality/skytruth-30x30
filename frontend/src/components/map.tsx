import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useEffect, useMemo } from 'react';

import { Minus, Plus } from 'lucide-react';
import type { Map as MapLibreType } from 'maplibre-gl';
import MapLibreMap, { Layer, Source } from 'react-map-gl/maplibre';

import { Button } from '@/components/ui/button';

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
      <div className="absolute top-3 right-3 z-10 flex flex-col">
        <Button
          type="button"
          size="icon"
          disabled={zoom === maxZoom}
          onClick={() =>
            map.zoomTo(Math.round(Math.min(map.getZoom() + 1, maxZoom)), { duration: 250 })
          }
        >
          <Plus className="h-6 w-6" aria-hidden />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={() =>
            map.zoomTo(Math.round(Math.max(map.getZoom() - 1, minZoom)), { duration: 250 })
          }
          disabled={zoom === minZoom}
        >
          <Minus className="h-6 w-6" aria-hidden />
          <span className="sr-only">Zoom out</span>
        </Button>
      </div>
    </MapLibreMap>
  );
};

export default Map;
