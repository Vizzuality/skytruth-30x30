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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'documentation.metadata': DocumentationMetadata;
    }
  }
}
