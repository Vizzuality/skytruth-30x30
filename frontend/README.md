# Frontend

## Config

The client needs to be configured with settings for accessig the API and external services. Please check the `.env.default` file for required environment variables. Those are set partially by Terraform in GH Secrets, and then passed into the docker images during deployment by GH Actions. Some are managed manually in GH Secrets. Please refer to [infrastructure documentation](../infrastructure/README.md) for details.

## Run locally

### Install

Go to the `client/` directory and install the dependencies:

```bash
yarn install
```

Copy the .env.example file to .env.local and fill in the NEXT_PUBLIC_API_URL field with the url of the API. (By default it's http://localhost:1337)

Add the NEXT_PUBLIC_MAPBOX_TOKEN field with the Mapbox token of the project. (You can get one [here](https://account.mapbox.com/access-tokens/))

### Start

Start the client with:

```bash
yarn dev
```

### Usage with Docker (recommended)
To run with docker:

docker-compose up --build

Open the app at http://localhost:3000
