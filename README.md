# skytruth-30x30
SkyTruth 30x30 Tracker is a compelling online experience that builds momentum towards meeting global biodiversity targets by unlocking opportunities for protecting the marine environment and forging connections with the wider 30x30 community.

## Maintenance documentation

### Key Components
- *Next.js Client*: The client-side application is developed using Next.js, a React framework that facilitates server-side rendering and efficient client-side navigation.

- *Strapi Headless CMS*: The back-end application is implemented using Strapi, which provides a flexible content management system and exposes APIs for dynamic data retrieval.

- *Analysis Cloud Function*: On-the-fly analysis results are generated through a cloud function, which connects to a spatially enabled PostgreSQL database.

- *Data Pipelines*: Data pipelines are responsible for feeding structured data into the SQL database and layers into Mapbox.

External services:

- *Mapbox*: used for serving layers for the map

- *HubSpot*: used for the contact form, see [configuration instructions](hubspot.md)

This repository contains all the code and documentation necessary to set up and deploy the project. It is organised in 5 main subdirectories, with accompanying documentation inside each.

| Subdirectory name | Description                                                 | Documentation                                                                                            |
|-------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| frontend          | The Next.js client application                            | [frontend/README.md](frontend/README.md)             |
| cms               | The Strapi CMS / API                            | [cms/README.md](cms/README.md)             |
| cloud_functions/analysis   | The on-the-fly analysis cloud function   | [cloud_functions/analysis/README.md](cloud_functions/analysis/README.md)               |
| data           | The Python data importers and uploaders   | [data/README.md](data/README.md)               |
| infrastructure    | The Terraform project & GH Actions workflow (provisioning & deployment to Google Cloud Platform) | [infrastructure/README.md](infrastructure/README.md) |

### Deployment and Infrastructure
The project is deployed on the Google Cloud Platform (GCP) using GitHub Actions for continuous integration and deployment. The infrastructure is provisioned and managed using Terraform scripts, ensuring consistent and reproducible deployments.
