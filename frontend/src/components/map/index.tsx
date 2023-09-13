import { useEffect, useState, useCallback, FC } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import { Map as MapLibreMap, FitBoundsOptions } from 'maplibre-gl';
import ReactMapGL, {
  ViewState,
  ViewStateChangeEvent,
  MapEvent,
  LngLatBoundsLike,
} from 'react-map-gl/maplibre';
import { useRecoilState } from 'recoil';
import { useDebounce } from 'usehooks-ts';

import { cn } from '@/lib/utils';

import { bboxAtom } from './atoms';
import { DEFAULT_VIEW_STATE } from './constants';
import type { MapProps } from './types';

export const Map: FC<MapProps> = ({
  // * if no id is passed, react-map-gl will store the map reference in a 'default' key:
  // * https://github.com/visgl/react-map-gl/blob/ecb27c8d02db7dd09d8104e8c2011bda6aed4b6f/src/components/use-map.tsx#L18
  id = 'default',
  children,
  className,
  viewState,
  constrainedAxis,
  initialViewState,
  bounds: externalBounds,
  onMapViewStateChange,
  dragPan = true,
  dragRotate = false,
  scrollZoom = true,
  doubleClickZoom = true,
  onLoad: externalOnLoad,
  ...rest
}) => {
  const [map, setMap] = useState<MapLibreMap | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [urlBbox, setUrlBbox] = useRecoilState(bboxAtom);
  const [localViewState, setLocalViewState] = useState<Partial<ViewState> | null>(
    !initialViewState
      ? {
          ...DEFAULT_VIEW_STATE,
          ...viewState,
          ...(urlBbox ? { bounds: urlBbox as LngLatBoundsLike } : {}),
        }
      : null
  );
  const debouncedLocalViewState = useDebounce(localViewState, 250);
  // Whether a bounds animation is playing
  const [isFlying, setFlying] = useState(false);
  // Store the timeout to restore `isFlying` to `false`
  const [flyingTimeout, setFlyingTimeout] = useState<number | null>(null);
  // Store whether the map has been interacted with
  const [mapInteractedWith, setMapInteractedWith] = useState(false);

  /**
   * CALLBACKS
   */
  const fitBounds = useCallback(
    (bounds: LngLatBoundsLike, options?: FitBoundsOptions) => {
      if (map && bounds) {
        // Enable fly mode to avoid the map being interrupted during the bounds transition
        setFlying(true);

        map.fitBounds(bounds, options);

        if (flyingTimeout) {
          window.clearInterval(flyingTimeout);
        }
        setFlyingTimeout(window.setTimeout(() => setFlying(false), options?.duration ?? 0));
      }
    },
    [flyingTimeout, map]
  );

  const onMove = useCallback(
    ({ viewState: _viewState }: ViewStateChangeEvent) => {
      const newViewState = {
        ..._viewState,
        latitude: constrainedAxis === 'y' ? localViewState?.latitude : _viewState.latitude,
        longitude: constrainedAxis === 'x' ? localViewState?.longitude : _viewState.longitude,
      };
      setLocalViewState(newViewState);
      setMapInteractedWith(true);
    },
    [constrainedAxis, localViewState?.latitude, localViewState?.longitude]
  );

  const onLoad = useCallback(
    (e: MapEvent) => {
      setLoaded(true);
      setMap(e.target);

      if (externalOnLoad) {
        externalOnLoad(e);
      }
    },
    [externalOnLoad]
  );

  useEffect(() => {
    if (map && externalBounds) {
      const { bbox, options } = externalBounds;
      fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        options
      );
    }
  }, [map, externalBounds, fitBounds]);

  // Restore the map's position from the URL i.e. set the map bounds based on what the URL contains
  // until the user has interacted with the map
  useEffect(() => {
    if (map && !mapInteractedWith && urlBbox) {
      fitBounds(urlBbox as LngLatBoundsLike, { animate: false });
    }
  }, [map, urlBbox, fitBounds, mapInteractedWith]);

  useEffect(() => {
    setLocalViewState((prevViewState) => ({
      ...prevViewState,
      ...viewState,
    }));
  }, [viewState]);

  // Store the map's position in the URL every time it changes after the user's interacted with the
  // map
  useEffect(() => {
    if (map && mapInteractedWith) {
      setUrlBbox(
        map
          .getBounds()
          .toArray()
          .flat()
          .map((b) => parseFloat(b.toFixed(2))) as [number, number, number, number]
      );
    }

    if (onMapViewStateChange) {
      onMapViewStateChange(debouncedLocalViewState);
    }
  }, [debouncedLocalViewState, map, mapInteractedWith, onMapViewStateChange, setUrlBbox]);

  return (
    <div className={cn('relative z-0 h-full w-full', className)}>
      <ReactMapGL
        id={id}
        initialViewState={initialViewState}
        dragPan={!isFlying && dragPan}
        dragRotate={!isFlying && dragRotate}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        scrollZoom={!isFlying && scrollZoom}
        doubleClickZoom={!isFlying && doubleClickZoom}
        onMove={onMove}
        onLoad={onLoad}
        {...rest}
        {...localViewState}
      >
        {!!map && loaded && !!children && children(map)}
      </ReactMapGL>
    </div>
  );
};

export default Map;
export { default as ZoomControls } from './zoom-controls';
