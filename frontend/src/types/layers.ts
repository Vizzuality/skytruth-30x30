import type { AnyLayer, AnySource } from 'react-map-gl';

import { FormatProps } from '@/lib/utils/formats';
import type { Layer } from '@/types/generated/strapi.schemas';

export type Config = {
  source: AnySource;
  styles: AnyLayer[];
};

export type ParamsConfigValue = {
  key: string;
  default: unknown;
};

export type ParamsConfig = Record<string, ParamsConfigValue>[];

export type LegendConfig = {
  type?: 'basic' | 'icon' | 'gradient' | 'choropleth';
  items?: {
    value?: string;
    icon?: string;
    color?: string;
    description?: string;
  }[];
};

export type InteractionConfig = {
  enabled: boolean;
  events: {
    type: 'click' | 'hover';
    values: {
      key: string;
      label: string;
      format?: FormatProps;
    }[];
  }[];
};

export type LayerProps = {
  id?: string;
  zIndex?: number;
  onAdd?: (props: Config) => void;
  onRemove?: (props: Config) => void;
};

export type LayerSettings = {
  opacity: number;
  visibility: boolean;
  expanded: boolean;
};

export type LayerTyped = Layer & {
  config: Config;
  params_config: ParamsConfig;
  legend_config: LegendConfig;
  interaction_config: InteractionConfig;
  metadata: Record<string, unknown>;
};
