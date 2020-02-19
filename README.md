![Build and push docker image](https://github.com/scotyboy56/azure-stub/workflows/Build%20and%20push%20docker%20image/badge.svg?branch=master)
[![GitHub version](https://badge.fury.io/gh/scotyboy56%2Fazure-stub.svg)](https://badge.fury.io/gh/scotyboy56%2Fazure-stub)
[![Generic badge](https://img.shields.io/badge/GITHUB-👍-black.svg)](https://shields.io/)

# Azure stub application

The Azure stub provides an offline solution for using Azure oauth, to authenticate your application.

It stubs the azure login page that returns a code (on successful login), as well as the token endpoint for retrieving the JWT using the code

The only flow it supports currently is the [code flow](https://docs.microsoft.com/en-us/azure/active-directory/azuread-dev/v1-protocols-oauth-code)

## How it works

The login URL works the same as if you were using an official Azure application, instead of going to `login.microsoftonline.com` for the login redirect, go to localhost (or the host that your stub is running on and the port)

An example of the URL:

`http://localhost:16008/azure/oauth2/authorize?client_id=client-id&response_type=code&scope=openid&redirect_uri=http://localhost:3000/login&response_mode=query&state=12345`

The client_id **must** match the client id either in the .env file or passed to the docker container as an environment variable

The redirect URI is the URL of your web app that the azure stub will redirect to on successful login

The token endpoint is a stub of the Azure token endpoint that uses the code from the authorize endpoint, it will return a JWT based on the object in the `user-values.json` for the relevant code passed to it

It expects a body like

```json
{
    "code": "1"
}
```

## Running locally

This is a [Node.js](https://nodejs.org/en/) web app.

### Before running

- [download and install Node.js](https://nodejs.org/en/download/).
(It has only been tested on Node.js v10)

- [download and install Yarn](https://classic.yarnpkg.com/en/docs/install/).

- Install dependencies

- Create a .env file in the root of the project

- Create the user config files

Dependency installation is done using the [`yarn install` command](https://classic.yarnpkg.com/en/docs/cli/install/)

```bash
$ yarn install
```

To create the `.env` file copy the `sample.env` file and rename it to `.env` and replace the values to the required values.

To create the user config files you need two json files `user-accounts.json` & `user-values.json` they will need to be in the directory specified in the .env file with `CONFIG_LOCATION`, examples of these can be found in `src/test/resources`

### Running the app

```bash
$ yarn start
```

## Docker Image

There is a provided [docker image](https://hub.docker.com/repository/docker/yolomcswaggins/azure-stub) on dockerhub that is built from the latest versions in master.

To build the docker image locally:

```bash
$ docker build . -f Docker/Dockerfile --tag yolomcswaggins/azure-stub
```

It requires 4 environment variables in order to run, and two config files

## Environment variables

The application requires 4 environment variables passed to it.

If running locally these will be located in the .env file that is created in the setup.

If running a docker image the environment variables are

- CLIENT_ID

    This is the client ID of your stubbed azure application, it will need to be the same client ID in both your frontend and backend services that call the stub

- PORT

    The port that the app will run on (Docker image is defaulted to port 80)

- ENVIRONMENT

    The environment you are running it in, this is used to create add a custom label to the prometheus metrics

- CONFIG_LOCATION

    The location on your disk that the two config files are located, in order to be loaded and used within the app

## Config files

The stub requires two config files in order to work an example of these can be found in `src/test/resources`

- user-accounts.json

- user-values.json

When running locally these must be in the location specified in the `.env` file, if running the docker image these must be passed in as config to the docker container being mapped to the location specified in the `CONFIG_LOCATION` environment passed to the container

### User accounts

This config file is what defines your stubbed users, each user contains 3 attributes

```json
{
    "username": "user",
    "password": "password",
    "code": "1"
}
```

The username and password are what the end user will need to type into the stubbed login page. The username needs to be unique per stubbed user

The code is what the stub returns in the login process, but a much smaller code than the one Azure does if using an official Azure application, this code needs to be unique per stubbed user

### User values

This config file is what defines how the JWT is defined when logging in. The application takes the object for the relevant code and converts the object into a JWT, this can contain anything due to an official azure application being configurable on what is returned

```json
  "1": {
    "given_name": "Joe",
    "family_name": "Bloggs",
    "username": "123456",
    "unique_name": "123456"
  }
```

The code **must** match the code in the `user-accounts.json` code for the relevant user

## Monitoring

The app exposes two endpoints for monitoring

- `/azure/health`

- `/azure/metrics`

The health endpoint returns a status code `200` and a json body if the service is up

```json
{
    "status": "UP"
}
```

The metrics endpoint is a prometheus endpoint that returns prometheus metrics in order to monitor the stub
