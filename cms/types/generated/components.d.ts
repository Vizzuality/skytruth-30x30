import type { Schema, Attribute } from '@strapi/strapi';

export interface DocumentationMetadata extends Schema.Component {
  collectionName: 'components_documentation_metadata';
  info: {
    displayName: 'Metadata';
    description: '';
  };
  attributes: {
    description: Attribute.RichText & Attribute.Required;
    citation: Attribute.RichText;
    source: Attribute.RichText;
    resolution: Attribute.String;
    content_date: Attribute.Date;
    license: Attribute.String;
  };
}

export interface LegendLegendItems extends Schema.Component {
  collectionName: 'components_legend_legend_items';
  info: {
    displayName: 'legend_items';
  };
  attributes: {
    icon: Attribute.String;
    color: Attribute.String;
    value: Attribute.String & Attribute.Required;
    description: Attribute.String;
  };
}

export interface LegendLegend extends Schema.Component {
  collectionName: 'components_legend_legends';
  info: {
    displayName: 'legend';
  };
  attributes: {
    type: Attribute.Enumeration<['basic', 'icon', 'choropleth', 'gradient']>;
    items: Attribute.Component<'legend.legend-items', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'documentation.metadata': DocumentationMetadata;
      'legend.legend-items': LegendLegendItems;
      'legend.legend': LegendLegend;
    }
  }
}
