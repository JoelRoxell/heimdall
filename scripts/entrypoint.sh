#!/bin/bash

bash /opt/nakd-consul/start.sh

# Leave consul cluster on exit.
trap "consul leave; exit 0" SIGINT SIGTERM

if [ "${NODE_ENV}" = "production" ]; then
  echo "Running in production mode..."
  node --harmony-async-await src/heimdall.js
elif [ "${NODE_ENV}" = "development" ]; then
  DEBUG=* ./node_modules/.bin/nodemon --inspect --harmony-async-await src/heimdall.js
fi

echo "Done"