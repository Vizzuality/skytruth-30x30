import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataInfoDataInfo extends Schema.CollectionType {
  collectionName: 'data_infos';
  info: {
    singularName: 'data-info';
    pluralName: 'data-infos';
    displayName: 'Data Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    content: Attribute.Text;
    data_sources: Attribute.Relation<
      'api::data-info.data-info',
      'oneToMany',
      'api::data-source.data-source'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-info.data-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-info.data-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataSourceDataSource extends Schema.CollectionType {
  collectionName: 'data_sources';
  info: {
    singularName: 'data-source';
    pluralName: 'data-sources';
    displayName: 'Data Source';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    title: Attribute.String & Attribute.Required;
    url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-source.data-source',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-source.data-source',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataToolDataTool extends Schema.CollectionType {
  collectionName: 'data_tools';
  info: {
    singularName: 'data-tool';
    pluralName: 'data-tools';
    displayName: 'Data Tool';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    site: Attribute.String;
    languages: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToMany',
      'api::data-tool-language.data-tool-language'
    >;
    data_tool_resource_type: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToOne',
      'api::data-tool-resource-type.data-tool-resource-type'
    >;
    data_tool_resource_types: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToMany',
      'api::data-tool-resource-type.data-tool-resource-type'
    >;
    geography: Attribute.Text;
    data_tool_ecosystems: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToMany',
      'api::data-tool-ecosystem.data-tool-ecosystem'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-tool.data-tool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataToolEcosystemDataToolEcosystem
  extends Schema.CollectionType {
  collectionName: 'data_tool_ecosystems';
  info: {
    singularName: 'data-tool-ecosystem';
    pluralName: 'data-tool-ecosystems';
    displayName: 'Data Tool Ecosystem';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-tool-ecosystem.data-tool-ecosystem',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-tool-ecosystem.data-tool-ecosystem',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataToolLanguageDataToolLanguage
  extends Schema.CollectionType {
  collectionName: 'data_tool_languages';
  info: {
    singularName: 'data-tool-language';
    pluralName: 'data-tool-languages';
    displayName: 'Data Tool Language';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.String & Attribute.Unique;
    data_tool: Attribute.Relation<
      'api::data-tool-language.data-tool-language',
      'manyToOne',
      'api::data-tool.data-tool'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-tool-language.data-tool-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-tool-language.data-tool-language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataToolResourceTypeDataToolResourceType
  extends Schema.CollectionType {
  collectionName: 'data_tool_resource_types';
  info: {
    singularName: 'data-tool-resource-type';
    pluralName: 'data-tool-resource-types';
    displayName: 'Data Tool Resource Type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-tool-resource-type.data-tool-resource-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-tool-resource-type.data-tool-resource-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFishingProtectionLevelFishingProtectionLevel
  extends Schema.CollectionType {
  collectionName: 'fishing_protection_levels';
  info: {
    singularName: 'fishing-protection-level';
    pluralName: 'fishing-protection-levels';
    displayName: 'Fishing Protection Level';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    info: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::fishing-protection-level.fishing-protection-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::fishing-protection-level.fishing-protection-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFishingProtectionLevelStatFishingProtectionLevelStat
  extends Schema.CollectionType {
  collectionName: 'fishing_protection_level_stats';
  info: {
    singularName: 'fishing-protection-level-stat';
    pluralName: 'fishing-protection-level-stats';
    displayName: 'Fishing Protection Level Stats';
    description: 'Calculation of area of protection by location and fishing protection level';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::fishing-protection-level-stat.fishing-protection-level-stat',
      'manyToOne',
      'api::location.location'
    >;
    fishing_protection_level: Attribute.Relation<
      'api::fishing-protection-level-stat.fishing-protection-level-stat',
      'oneToOne',
      'api::fishing-protection-level.fishing-protection-level'
    >;
    area: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::fishing-protection-level-stat.fishing-protection-level-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::fishing-protection-level-stat.fishing-protection-level-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHabitatHabitat extends Schema.CollectionType {
  collectionName: 'habitats';
  info: {
    singularName: 'habitat';
    pluralName: 'habitats';
    displayName: 'Habitat';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    info: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::habitat.habitat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::habitat.habitat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHabitatStatHabitatStat extends Schema.CollectionType {
  collectionName: 'habitat_stats';
  info: {
    singularName: 'habitat-stat';
    pluralName: 'habitat-stats';
    displayName: 'Habitat Stats';
    description: 'Calculation of area of protection by location, habitat and year';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::habitat-stat.habitat-stat',
      'oneToOne',
      'api::location.location'
    >;
    habitat: Attribute.Relation<
      'api::habitat-stat.habitat-stat',
      'oneToOne',
      'api::habitat.habitat'
    >;
    year: Attribute.Integer & Attribute.Required;
    protectedArea: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    totalArea: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::habitat-stat.habitat-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::habitat-stat.habitat-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLayerLayer extends Schema.CollectionType {
  collectionName: 'layers';
  info: {
    singularName: 'layer';
    pluralName: 'layers';
    displayName: 'Layer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['mapbox', 'deckgl', 'carto']>;
    config: Attribute.JSON & Attribute.Required;
    params_config: Attribute.JSON & Attribute.Required;
    legend_config: Attribute.JSON & Attribute.Required;
    interaction_config: Attribute.JSON;
    metadata: Attribute.Component<'documentation.metadata'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::layer.layer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::layer.layer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLocationLocation extends Schema.CollectionType {
  collectionName: 'locations';
  info: {
    singularName: 'location';
    pluralName: 'locations';
    displayName: 'Location';
    description: 'Stores names of geographical locations of different types (worldwide, country, region).';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    totalMarineArea: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    type: Attribute.String & Attribute.Required;
    groups: Attribute.Relation<
      'api::location.location',
      'manyToMany',
      'api::location.location'
    >;
    members: Attribute.Relation<
      'api::location.location',
      'manyToMany',
      'api::location.location'
    >;
    fishing_protection_level_stats: Attribute.Relation<
      'api::location.location',
      'oneToMany',
      'api::fishing-protection-level-stat.fishing-protection-level-stat'
    >;
    mpaa_protection_level_stats: Attribute.Relation<
      'api::location.location',
      'oneToMany',
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat'
    >;
    protection_coverage_stats: Attribute.Relation<
      'api::location.location',
      'oneToMany',
      'api::protection-coverage-stat.protection-coverage-stat'
    >;
    bounds: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMpaMpa extends Schema.CollectionType {
  collectionName: 'mpas';
  info: {
    singularName: 'mpa';
    pluralName: 'mpas';
    displayName: 'MPA';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    wdpaid: Attribute.Integer;
    name: Attribute.String & Attribute.Required;
    area: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    year: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    mpaa_establishment_stage: Attribute.Relation<
      'api::mpa.mpa',
      'oneToOne',
      'api::mpaa-establishment-stage.mpaa-establishment-stage'
    >;
    protection_status: Attribute.Relation<
      'api::mpa.mpa',
      'oneToOne',
      'api::protection-status.protection-status'
    >;
    mpa_protection_coverage_stats: Attribute.Relation<
      'api::mpa.mpa',
      'oneToMany',
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::mpa.mpa', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::mpa.mpa', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiMpaProtectionCoverageStatMpaProtectionCoverageStat
  extends Schema.CollectionType {
  collectionName: 'mpa_protection_coverage_stats';
  info: {
    singularName: 'mpa-protection-coverage-stat';
    pluralName: 'mpa-protection-coverage-stats';
    displayName: 'MPA Protection Coverage Stats';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    mpa: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'manyToOne',
      'api::mpa.mpa'
    >;
    fishing_protection_level: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'oneToOne',
      'api::fishing-protection-level.fishing-protection-level'
    >;
    mpaa_protection_level: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'oneToOne',
      'api::mpaa-protection-level.mpaa-protection-level'
    >;
    location: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'oneToOne',
      'api::location.location'
    >;
    area: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMpaaEstablishmentStageMpaaEstablishmentStage
  extends Schema.CollectionType {
  collectionName: 'mpaa_establishment_stages';
  info: {
    singularName: 'mpaa-establishment-stage';
    pluralName: 'mpaa-establishment-stages';
    displayName: 'MPAA Establishment Stage';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    info: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mpaa-establishment-stage.mpaa-establishment-stage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mpaa-establishment-stage.mpaa-establishment-stage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMpaaEstablishmentStageStatMpaaEstablishmentStageStat
  extends Schema.CollectionType {
  collectionName: 'mpaa_establishment_stage_stats';
  info: {
    singularName: 'mpaa-establishment-stage-stat';
    pluralName: 'mpaa-establishment-stage-stats';
    displayName: 'MPAA Establishment Stage Stats';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat',
      'oneToOne',
      'api::location.location'
    >;
    mpaa_establishment_stage: Attribute.Relation<
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat',
      'oneToOne',
      'api::mpaa-establishment-stage.mpaa-establishment-stage'
    >;
    protection_status: Attribute.Relation<
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat',
      'oneToOne',
      'api::protection-status.protection-status'
    >;
    year: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    area: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMpaaProtectionLevelMpaaProtectionLevel
  extends Schema.CollectionType {
  collectionName: 'mpaa_protection_levels';
  info: {
    singularName: 'mpaa-protection-level';
    pluralName: 'mpaa-protection-levels';
    displayName: 'MPAA Protection Level';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    info: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mpaa-protection-level.mpaa-protection-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mpaa-protection-level.mpaa-protection-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMpaaProtectionLevelStatMpaaProtectionLevelStat
  extends Schema.CollectionType {
  collectionName: 'mpaa_protection_level_stats';
  info: {
    singularName: 'mpaa-protection-level-stat';
    pluralName: 'mpaa-protection-level-stats';
    displayName: 'MPAA Protection Level Stats';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat',
      'manyToOne',
      'api::location.location'
    >;
    mpaa_protection_level: Attribute.Relation<
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat',
      'oneToOne',
      'api::mpaa-protection-level.mpaa-protection-level'
    >;
    area: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProtectionCoverageStatProtectionCoverageStat
  extends Schema.CollectionType {
  collectionName: 'protection_coverage_stats';
  info: {
    singularName: 'protection-coverage-stat';
    pluralName: 'protection-coverage-stats';
    displayName: 'Protection Coverage Stats';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::protection-coverage-stat.protection-coverage-stat',
      'manyToOne',
      'api::location.location'
    >;
    protection_status: Attribute.Relation<
      'api::protection-coverage-stat.protection-coverage-stat',
      'oneToOne',
      'api::protection-status.protection-status'
    >;
    year: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    cumSumProtectedArea: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    protectedArea: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    protectedAreasCount: Attribute.Integer & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::protection-coverage-stat.protection-coverage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::protection-coverage-stat.protection-coverage-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProtectionStatusProtectionStatus
  extends Schema.CollectionType {
  collectionName: 'protection_statuses';
  info: {
    singularName: 'protection-status';
    pluralName: 'protection-statuses';
    displayName: 'Protection Status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    name: Attribute.String & Attribute.Required;
    info: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::protection-status.protection-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::protection-status.protection-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::data-info.data-info': ApiDataInfoDataInfo;
      'api::data-source.data-source': ApiDataSourceDataSource;
      'api::data-tool.data-tool': ApiDataToolDataTool;
      'api::data-tool-ecosystem.data-tool-ecosystem': ApiDataToolEcosystemDataToolEcosystem;
      'api::data-tool-language.data-tool-language': ApiDataToolLanguageDataToolLanguage;
      'api::data-tool-resource-type.data-tool-resource-type': ApiDataToolResourceTypeDataToolResourceType;
      'api::fishing-protection-level.fishing-protection-level': ApiFishingProtectionLevelFishingProtectionLevel;
      'api::fishing-protection-level-stat.fishing-protection-level-stat': ApiFishingProtectionLevelStatFishingProtectionLevelStat;
      'api::habitat.habitat': ApiHabitatHabitat;
      'api::habitat-stat.habitat-stat': ApiHabitatStatHabitatStat;
      'api::layer.layer': ApiLayerLayer;
      'api::location.location': ApiLocationLocation;
      'api::mpa.mpa': ApiMpaMpa;
      'api::mpa-protection-coverage-stat.mpa-protection-coverage-stat': ApiMpaProtectionCoverageStatMpaProtectionCoverageStat;
      'api::mpaa-establishment-stage.mpaa-establishment-stage': ApiMpaaEstablishmentStageMpaaEstablishmentStage;
      'api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat': ApiMpaaEstablishmentStageStatMpaaEstablishmentStageStat;
      'api::mpaa-protection-level.mpaa-protection-level': ApiMpaaProtectionLevelMpaaProtectionLevel;
      'api::mpaa-protection-level-stat.mpaa-protection-level-stat': ApiMpaaProtectionLevelStatMpaaProtectionLevelStat;
      'api::protection-coverage-stat.protection-coverage-stat': ApiProtectionCoverageStatProtectionCoverageStat;
      'api::protection-status.protection-status': ApiProtectionStatusProtectionStatus;
    }
  }
}
