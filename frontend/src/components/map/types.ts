import type { FitBoundsOptions, Map as MapLibreMap } from 'maplibre-gl';
import type { ViewState, MapProps as ReactMapGLProps } from 'react-map-gl/maplibre';

export interface MapProps extends ReactMapGLProps {
  id?: string;
  /** A function that returns the map instance */
  children?: (map: MapLibreMap) => React.ReactNode;
  /** Custom css class for styling */
  className?: string;
  /** An string that defines the rotation axis */
  constrainedAxis?: 'x' | 'y';
  /** An object that defines the bounds */
  bounds?: {
    bbox: readonly [number, number, number, number];
    options?: FitBoundsOptions;
    viewportOptions?: Partial<ViewState>;
  };
  /** A function that exposes the viewport */
  onMapViewStateChange?: (viewstate: Partial<ViewState>) => void;
}
