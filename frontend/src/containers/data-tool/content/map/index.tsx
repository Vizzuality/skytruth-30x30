import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import LayerManager from '@/components/layer-manager';
import Map, { ZoomControls, LayersDropdown, Legend, Attributions, Drawing } from '@/components/map';
import { useSyncMapSettings } from '@/containers/map/sync-settings';

const DataToolMap: React.FC = () => {
  const [{ bbox }, setMapSettings] = useSyncMapSettings();
  const { default: map } = useMap();

  const handleMoveEnd = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setMapSettings((prev) => ({
      ...prev,
      bbox: map
        .getBounds()
        .toArray()
        .flat()
        .map((b) => parseFloat(b.toFixed(2))) as typeof bbox,
    }));
  }, [map, setMapSettings]);

  return (
    <Map
      initialViewState={{
        bounds: bbox,
      }}
      onMoveEnd={handleMoveEnd}
      renderWorldCopies={false}
      attributionControl={false}
    >
      <>
        <div>
          <LayersDropdown />
          <Legend />
        </div>
        <ZoomControls />
        <LayerManager />
        <Drawing />
        <Attributions />
      </>
    </Map>
  );
};

export default DataToolMap;
