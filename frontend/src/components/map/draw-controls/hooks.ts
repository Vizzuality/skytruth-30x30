import { useEffect, useMemo } from 'react';

import { useMap, FillLayer, LineLayer, CircleLayer } from 'react-map-gl';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Feature } from 'geojson';
import { IControl } from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// See https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/EXAMPLES.md
export const DRAW_STYLES: (
  | Omit<FillLayer, 'source'>
  | Omit<LineLayer, 'source'>
  | Omit<CircleLayer, 'source'>
)[] = [
  // ACTIVE (being drawn)
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': '#000',
      'fill-outline-color': '#000',
      'fill-opacity': 0.2,
    },
  },
  // polygon mid points
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#fbb03b',
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 2,
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 6,
      'circle-color': '#000',
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 4,
      'circle-color': '#fff',
    },
  },
];

export interface UseMapboxDrawProps {
  enabled?: boolean;
  onCreate?: (evt: { features: Feature[] }) => void;
  onUpdate?: (evt: { features: Feature[]; action: string }) => void;
  onClick?: () => void;
  onDelete?: (evt: { features: Feature[] }) => void;
}

export const useMapboxDraw = (props?: UseMapboxDrawProps) => {
  const { current: map } = useMap();

  const draw = useMemo(() => {
    // We override the `onClick` method to send an extra event
    const DrawPolygonMode = MapboxDraw.modes.draw_polygon;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const DrawPolygonModeOnClick = DrawPolygonMode.onClick;
    DrawPolygonMode.onClick = function (
      ...params: Parameters<typeof MapboxDraw.modes.draw_polygon.onClick>
    ) {
      // The event must be thrown first so that draw.create is thrown afterwards when closing the
      // shape
      this.map.fire('draw.click', {});
      DrawPolygonModeOnClick.apply(this, params);
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const DrawPolygonModeOnTap = DrawPolygonMode.onTap;
    DrawPolygonMode.onTap = function (
      ...params: Parameters<typeof MapboxDraw.modes.draw_polygon.onTap>
    ) {
      // The event must be thrown first so that draw.create is thrown afterwards when closing the
      // shape
      this.map.fire('draw.click', {});
      DrawPolygonModeOnTap.apply(this, params);
    };

    return new MapboxDraw({
      defaultMode: 'simple_select',
      modes: {
        // We override this mode so that when the user presses ESC, they can draw again
        simple_select: DrawPolygonMode,
      },
      displayControlsDefault: false,
      keybindings: false, // Disabled because no events are sent with ENTER or ESC
      boxSelect: false,
      styles: DRAW_STYLES,
    });
  }, []);

  useEffect(() => {
    if (!props.enabled) {
      return;
    }

    map.addControl(draw as unknown as IControl, 'top-left');

    map.on('draw.create', props?.onCreate);
    map.on('draw.click', props?.onClick);
    map.on('draw.update', props?.onUpdate);
    map.on('draw.delete', props?.onDelete);

    return () => {
      map.removeControl(draw as unknown as IControl);

      map.off('draw.create', props?.onCreate);
      map.off('draw.click', props?.onClick);
      map.off('draw.update', props?.onUpdate);
      map.off('draw.delete', props?.onDelete);
    };
  }, [props, map, draw]);

  return draw;
};
