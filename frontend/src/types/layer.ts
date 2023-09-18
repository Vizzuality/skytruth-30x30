import type {
  BackgroundLayer,
  CircleLayer,
  FillLayer,
  FillExtrusionLayer,
  HeatmapLayer,
  HillshadeLayer,
  LineLayer,
  RasterLayer,
  SymbolLayer,
  AnySource,
} from 'react-map-gl/maplibre';

export type LayerType = 'default' | 'mapbox';

export interface LayerMetadata {
  // description?: string;
  // citation?: string;
  // source?: string;
  // resolution?: string;
  // contentDate?: string;
  // license?: string;
  attributions?: string;
}

export interface Layer {
  id: number;
  name: string;
  type: LayerType;
  config: {
    type: string;
    source: AnySource;
    layers?: (
      | Omit<BackgroundLayer, 'source'>
      | Omit<CircleLayer, 'source'>
      | Omit<FillLayer, 'source'>
      | Omit<FillExtrusionLayer, 'source'>
      | Omit<HeatmapLayer, 'source'>
      | Omit<HillshadeLayer, 'source'>
      | Omit<LineLayer, 'source'>
      | Omit<RasterLayer, 'source'>
      | Omit<SymbolLayer, 'source'>
    )[];
  };
  // paramsConfig?: unknown;
  legend: {
    type: 'basic' | 'choropleth' | 'gradient';
    items: { value: string; color: string }[];
  };
  // interactionConfig?: unknown;
  metadata?: LayerMetadata;
}

export interface LayerSettings {
  visibility?: boolean;
  opacity?: number;
  expanded?: boolean;
}
