# Prizm


## Setup

``` bash
# download service account private key JSON from https://console.cloud.google.com/apis/credentials/serviceaccountkey?project=${projectId}
$ mv ${pathToPrivateKeyJson} $PWD/server/gcp_credentials.json

# set environment variable for path to service account credentials
$ export GOOGLE_APPLICATION_CREDENTIALS=$PWD/server/gcp_credentials.json

# install dependencies
$ npm install # Or yarn install
```

## Development

``` bash
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## Deploy
``` bash
# deploy to app engine
$ gcloud app deploy
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
