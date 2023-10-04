# Infrastructure

While the application can be deployed in any server configuration that supports the application's dependencies, this project includes a [Terraform](https://www.terraform.io/) project that you can use to easily and quickly deploy it using
[Google Cloud Platform](https://cloud.google.com/).

## Dependencies

Here is the list of technical dependencies for deploying the SkyTruth 30x30 Dashboard app using these infrastructure
resources. Note that these requirements are for this particular deployment strategy, and not dependencies of the SkyTruth 30x30 Dashboard application itself - which can be deployed to other infrastructures.

Before proceeding, be sure you are familiar with all of these tools, as these instructions
will skip over the basics, and assume you are conformable using all of them.

- [Google Cloud Platform](https://cloud.google.com)
- [Terraform](https://www.terraform.io/)
- [Docker](https://www.docker.com/)
- [Github](https://github.com)
- [Github Actions](https://github.com/features/actions)
- DNS management
- A purchased domain

## Structure

This project has 2 main sections, each of which with a folder named after it. Each of these sections has a Terraform project, that logically depends on their predecessors. There is a 3rd component to this architecture, which is handled by Github Actions.

#### Remote state

Creates a [GCP Storage Bucket](https://cloud.google.com/storage/docs/json_api/v1/buckets)
that will store the Terraform remote state.

#### Base

Contains multiple GCP resources needed for running SkyTruth 30x30 Dashboard on GCP.

These resources include, but are not limited to:

- Google Compute instance - bastion host to access the GCP infrastructure
- Artifact Registry, for docker image storage
- Cloud Run, to host the live applications
- Cloud SQL, for relational data storage
- Networking resources
- Uptime monitoring
- Error reporting

To apply this project, you will need the following GCP permissions. These could probably be further fleshed out to a
more restrictive set of permissions/roles, but this combination is know to work:

- "Editor" role
- "Secret Manager Admin" role
- "Cloud Run Admin" role
- "Compute Network Admin" role
- "Security Admin" role

The output values include access data for some of the resources above.

Please note, there are some actions that need to be carried out manually - you'll get a promt from terraform with links to follow to complete the actions:
- Compute Engine API needs to be enabled

#### Github Actions

As part of this infrastructure, Github Actions are used to automatically build and push Docker images to [Artifact Registry](https://cloud.google.com/artifact-registry), and to deploy those images to CloudRun once they are pushed. Access by Github to GCP is configured through special authorization rules, automatically set up by the Terraform `base` project above.
These permissions are necessary for the service account that runs the deployment:
- "roles/iam.serviceAccountTokenCreator",
- "roles/iam.serviceAccountUser",
- "roles/run.developer",
- "roles/artifactregistry.reader",
- "roles/artifactregistry.writer"

There are 2 CloudRun instances, one for the client application and one for the API. Github Secrets are used to provide environment secrets to these instances. Some of the secrets are managed by terraform when provisioning resources (e.g. database credentials for the API). To make it clear, the respective GH Secrets are suffixed "TF_MANAGED".

## How to deploy

Deploying the included Terraform project is done in steps:

- Terraform `apply` the `Remote State` project.
- Terraform `apply` the `Base` project.

For both commands, please use `-var-file=vars/terraform.tfvars`` to provide the necessary terraform variables.

For the latter step, you will also need to set 2 environment variables:
- GITHUB_TOKEN (your GH token)
- GITHUB_OWNER (Vizzuality)
to allow terraform to write to GH Secrets.

Please note: when provisioning for the first time in a clean project, amend the `cloudrun` module by uncommenting the image setting to be used for first time deployment, which deploys a dummy "hello" image (because actual application images are going to be available in GAR only once the infrastructure is provisioned and the GH Actions deployment passed)

## Maintenance

### Connecting to the Cloud SQL databases

In case you need to access the Postgres database for the app, running in Cloud SQL, you can follow these steps.
This is a slimmed down version of [this guide](https://medium.com/google-cloud/cloud-sql-with-private-ip-only-the-good-the-bad-and-the-ugly-de4ac23ce98a)

- user needs to have IAP-secured Tunnel User role
- (one time per user) Run `gcloud compute ssh x30-dev-bastion` to SSH into the bastion host
- (one time per bastion host) Inside the bastion host, download
  the [Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy),
  apply `chmod a+x` and make sure it's in an executable path.
- (when connecting) Run `gcloud compute start-iap-tunnel <bastion instance name> 22 --local-host-port=localhost:4226` locally. This will start a tunnel, which you must keep open for the duration of your access to the SQL database
- (when connecting) Run `ssh -L 3306:localhost:3306 -i ~/.ssh/google_compute_engine -p 4226 localhost -- cloud_sql_proxy -instances=<sql instance connection name>=tcp:3306`
  locally. This will start a 2nd tunnel, which you must also keep open for the duration of your access to the SQL database
- The remote Postgres database is now reachable on `localhost:3306`

## Backups

There are two main permanent data storage mechanisms in the SkyTruth 30x30 Dashboard application that need backup.

### SQL

The project's backend application relies on a PostgreSQL database, that is implemented in the infrastructure using GCP's Cloud SQL. Cloud SQL has a built-in backup functionality, which is currently configured to create a backup daily, and keep it for 30 days. Backup restoration can be done manually. Refer to the official GCP documentation on this
feature for instructions and more details.

### Object Storage

The application stores certain files in object storage, which is implemented in the infrastructure using GCP's Cloud Storage. Cloud Storage has built-in versioning functionality, which allows accessing old versions of a file, should it
be modified, as well as accessing deleted files. Refer to the official GCP documentation on this feature for more details, and instructions on how to use it to recover lost data.
