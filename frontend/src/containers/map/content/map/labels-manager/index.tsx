import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { useSyncMapSettings } from '@/containers/map/content/map/sync-settings';

const LABELS_LAYER_ID = 'country-label';

const LabelsManager = () => {
  const { default: mapRef } = useMap();
  const [{ labels }] = useSyncMapSettings();

  const toggleLabels = useCallback(() => {
    if (!mapRef) return;
    const map = mapRef.getMap();

    map.setLayoutProperty(LABELS_LAYER_ID, 'visibility', labels ? 'visible' : 'none');
  }, [mapRef, labels]);

  const handleStyleLoad = useCallback(() => {
    toggleLabels();
  }, [toggleLabels]);

  useEffect(() => {
    if (!mapRef) return;
    mapRef.on('style.load', handleStyleLoad);

    return () => {
      mapRef.off('style.load', handleStyleLoad);
    };
  }, [mapRef, handleStyleLoad]);

  useEffect(() => {
    if (!mapRef) return;
    toggleLabels();
  }, [mapRef, toggleLabels]);

  return null;
};

export default LabelsManager;
