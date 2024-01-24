# CMS / API

This directory contains a [Strapi](https://strapi.io/) headless CMS, which provides a backoffice and an API for .

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

## Config

The CMS needs to be configured with server and PostgreSQL database instance connection details. Please check the `.env.example` file for required environment variables. Those are set by Terraform in GH Secrets, and then passed into the docker images during deployment by GH Actions. Please refer to [infrastructure documentation](../infrastructure/README.md) for details.

## Run locally

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run dev
# or
yarn dev
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

### Usage with Docker (recommended)
To run with docker:

docker-compose up --build

Open the app at http://localhost:1337

## Deploy

Deployment to GCP handled by GH Actions. Please refer to [infrastructure documentation](../infrastructure/README.md).

## API documentation

The documentation is available at `/documentation` path locally, `/cms/documentation` in staging / production.

## Strapi data models

The data model definitions can be found in `src/api`. Each model corresponds to a database table, with linking tables where there are associations between models.

What is important to note is that the data might be updated differently depending on model. 

### Models updated via the admin backoffice

These models are intended to be updated manually. 

*For all models which contain a slug, that needs to managed carefully, as it is referenced either in the client application or the data pipelines.*

Models for the Knowledge Hub:

- data-tool
- data-tool-ecosystem
- data-tool-language
- data-tool-resource-type

Layers for the map:

- layer

Tooltips and dictionary values for the dashboard:

- data-info
- data-source
- fishing-protection-leel
- habitat
- location
- mpa
- mpaa-establishment-stage
- mpaa-protection-level
- protection-status

### Models updated by scripts

These models are updated by an import script, which utilises the Strapi import / export API. Please refer to [data documentation](../data/README.md).

- fishing-protection-level-stat
- habitat-stat
- mpa-protection-coverage-stat
- mpaa-establishment-stage-stat
- mpaa-protection-level-stat
- protection-coverage-stat

## config-sync plugin and configuration version control
This Strapi is configured to use the [config-sync plugin](https://market.strapi.io/plugins/strapi-plugin-config-sync), which allows to version control config data and migrate it between environments.

Examples of configuration under config-sync are user and admin role permissions, API permissions and settings of the admin panel. The consequence of this is that if any settings are changed directly in the staging / production admin panel, but not synced in the repository, they will be overwitten on subsequent deployments.

## Strapi resources

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!
