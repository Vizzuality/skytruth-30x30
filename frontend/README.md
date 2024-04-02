# Frontend

## Config

The client needs to be configured with settings for accessig the API and external services. Please check the `.env.default` file for required environment variables. Those are set partially by Terraform in GH Secrets, and then passed into the docker images during deployment by GH Actions. Some are managed manually in GH Secrets. Please refer to [infrastructure documentation](../infrastructure/README.md) for details.

See [HubSpot configuration details](../hubspot.md).

## Run locally

### Install

Go to the `client/` directory and install the dependencies:

```bash
yarn install
```

Copy the .env.example file to .env.default and fill in the fields with values from LastPass. 

**Note:**

`HTTP_AUTH_*` and `NEXTAUTH_*` fields enable temporary auth with a hardcoded user/pass for pre-launch purposes. If all fields are set, a username and password will be required. Auth details are available on LastPass. 

### Start

Start the client with:

```bash
yarn dev
```

### Usage with Docker (recommended)
To run with docker:

docker-compose up --build

Open the app at http://localhost:3000
