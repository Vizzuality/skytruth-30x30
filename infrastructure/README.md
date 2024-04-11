# Infrastructure

While the application can be deployed in any server configuration that supports the application's dependencies, this project includes:
- a [Terraform](https://www.terraform.io/) project that you can use to easily and quickly provision the resources and deploy the code using [Google Cloud Platform](https://cloud.google.com/),
- and a GH Actions workflow to deploy code updates.

![GCP infrastructure - GH Actions drawio](https://github.com/Vizzuality/skytruth-30x30/assets/134055/c20e52d4-89f0-42e2-be25-e6b76a3a4fe6)

## Dependencies

Here is the list of technical dependencies for deploying the SkyTruth 30x30 Dashboard app using these infrastructure resources. Note that these requirements are for this particular deployment strategy, and not dependencies of the SkyTruth 30x30 Dashboard application itself - which can be deployed to other infrastructures.

Before proceeding, be sure you are familiar with all of these tools, as these instructions will skip over the basics, and assume you are comfortable using all of them.

- [Google Cloud Platform](https://cloud.google.com) and [gcloud CLI tool](https://cloud.google.com/sdk/docs/install)
- [Terraform](https://www.terraform.io/)
- [Docker](https://www.docker.com/)
- [GitHub](https://github.com)
- [GitHub Actions](https://github.com/features/actions)
- DNS management
- A purchased domain

## Infrastructure project files

There are 2 terraform projects in the infrastructure directory, placed in subdirectories:
1. remote-state
2. base - depends on remote-state

Also, there is a GH Actions workflow file in the `.github` directory in the top-level project directory.

### Terraform

#### Remote state

Creates a [GCP Storage Bucket](https://cloud.google.com/storage/docs/json_api/v1/buckets), which will store the Terraform remote state.

#### Base

Contains multiple GCP resources needed for running SkyTruth 30x30 Dashboard on GCP.

These resources include, but are not limited to:

- Google Compute instance - bastion host to access the GCP infrastructure
- Artifact Registry, for docker image storage
- Cloud Run, to host the client application and the API/CMS
- Cloud Functions, for serving the analysis results
- Cloud SQL, for relational data storage
- Networking resources
- Uptime monitoring
- Error reporting
- Service accounts and permissions
- GH Secrets

To apply this project, you will need the following GCP permissions. These could probably be further fleshed out to a more restrictive set of permissions/roles, but this combination is know to work:

- "Editor" role
- "Secret Manager Admin" role
- "Cloud Run Admin" role
- "Compute Network Admin" role
- "Security Admin" role

The output values include access data for some of the resources above.

Please note, there are some actions that might to be carried out manually - you'll get a promt from terraform with links to follow to complete the actions, e.g.:
- Compute Engine API needs to be enabled

#### How to run

First, authenticate with GCP. The easiest way to do this is to run `gcloud auth application-default login`.

To verify your credentials were applied correctly, you can use
`gcloud projects list`
to check projects available to the authenticated account. To make double sure you're working on the correct project, you can also run
`gcloud config set project [project id]` 

Next, check and adapt if necessary the contents of `infrastructure/base/vars/terraform.tfvars`. For example, set the email address used for sendig alert notifications.

You will need to initialize both terraform projects by running:
`terraform init`

in their respective directories.

Deploying the Terraform project is done in steps:

1. Apply the `Remote State` project first. This needs to be done once.

While in `infrastructure/remote-state` directory:

`terraform apply`

2. Apply the `Base` project. This needs to be repeated after any changes in the base project.

_Please note: when doing this for the first time in a clean project, or a new environment, use the `use_hello_world_image` variable, so that it deploys a dummy "hello" image. This is to work around the fact that actual application images are going to be available in the image repository only once the infrastructure is provisioned and the GH Actions deployment passed._

While in `infrastructure/base` directory:

`GITHUB_TOKEN=... GITHUB_OWNER=.. terraform apply -var-file=vars/terraform.tfvars`

The GH env vars are needed for Terraform to be able to set GH Actions Secrets & Variables.

### GitHub Actions

As part of this infrastructure, GitHub Actions are used to automatically apply code updates for the client application, API/CMS and the cloud functions.

#### Service account permissions

Access by GitHub to GCP is configured through special authorization rules, automatically set up by the Terraform `base` project above.
These permissions are necessary for the service account that runs the deployment:
- "roles/iam.serviceAccountTokenCreator",
- "roles/iam.serviceAccountUser",
- "roles/run.developer",
- "roles/artifactregistry.reader",
- "roles/artifactregistry.writer",
- "roles/cloudfunctions.developer"

#### Building new code versions

Deployment to the CloudRun instances is accomplished by building Docker images and pushing them to [Artifact Registry](https://cloud.google.com/artifact-registry). When building the images, environment secrets are injected from GH Secrets as follows:
- for the client application:
  - the following secrets set by terraform in STAGING_CLIENT_ENV_TF_MANAGED (in the format of an .env file):
    - NEXT_PUBLIC_URL
    - NEXT_PUBLIC_API_URL
    - NEXT_PUBLIC_ANALYSIS_CF_URL
    - NEXT_PUBLIC_ENVIRONMENT
    - LOG_LEVEL
  - additional secrets set manually in STAGING_CLIENT_ENV (copy to be managed in LastPass)
- for the CMS/API application
  - the following secrets set by terraform in STAGING_CMS_ENV_TF_MANAGED (in the format of an .env file):
    - HOST
    - PORT
    - APP_KEYS
    - API_TOKEN_SALT
    - ADMIN_JWT_SECRET
    - TRANSFER_TOKEN_SALT
    - JWT_SECRET
    - CMS_URL
    - DATABASE_CLIENT
    - DATABASE_HOST
    - DATABASE_NAME
    - DATABASE_USERNAME
    - DATABASE_PASSWORD
    - DATABASE_SSL

Deployment to the cloud function is accomplished by pushing the source code. Secrets and env vars are set via Terraform.

The workflow is currently set up to **deploy automatically**:
- to the production instance when merging to `main` branch,
- to staging when merging to `develop` branch.

## Maintenance

### Connecting to the Cloud SQL databases

In case you need to access the Postgres database for the app, running in Cloud SQL, you can follow these steps.
This is a slimmed down version of [this guide](https://medium.com/google-cloud/cloud-sql-with-private-ip-only-the-good-the-bad-and-the-ugly-de4ac23ce98a)

You will need the following information from the Google Cloud console:
- <bastion-instance-name> - name of the bastion host VM instance in Compute Engine
- <sql instance connection name> - connection name of the Cloud SQL instance
- database password - secrets manager

You will also need to ensure that the user has IAP-secured Tunnel User role.

Steps:
1. (one time per user) Run `gcloud compute ssh <bastion instance name>` to SSH into the bastion host
2. (one time per user) Inside the bastion host, follow the [steps to download and install
  the Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy#install)
3. (when connecting) Run `gcloud compute start-iap-tunnel <bastion instance name> 22 --local-host-port=localhost:4226` locally. This will start a tunnel, which you must keep open for the duration of your access to the SQL database
4. (when connecting) Run `ssh -L 5433:localhost:5433 -i ~/.ssh/google_compute_engine -p 4226 localhost -- ./cloud-sql-proxy <sql instance connection name> --port=5433 --private-ip` locally. This will start a 2nd tunnel, which you must also keep open for the duration of your access to the SQL database
5. The remote Postgres database is now reachable on a local port 5433: `psql -h 127.0.0.1 -p 5433 -U db_user -W db_name`

## Backups

There are two main permanent data storage mechanisms in the SkyTruth 30x30 Dashboard application that need backup.

### SQL

The project's backend application relies on a PostgreSQL database, that is implemented in the infrastructure using GCP's Cloud SQL. Cloud SQL has a built-in backup functionality, which is currently configured to create a backup daily, and keep it for 30 days. Backup restoration can be done manually. Refer to the official GCP documentation on this
feature for instructions and more details.

### Object Storage

The application stores certain files in object storage, which is implemented in the infrastructure using GCP's Cloud Storage. Cloud Storage has built-in versioning functionality, which allows accessing old versions of a file, should it
be modified, as well as accessing deleted files. Refer to the official GCP documentation on this feature for more details, and instructions on how to use it to recover lost data.
