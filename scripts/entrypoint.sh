#!/bin/bash
if [ "${NODE_ENV}" = "production" ]; then
  echo "Running in production mode..."
  node --harmony-async-await src/heimdall.js
elif [ "${NODE_ENV}" = "development" ]; then
  DEBUG=* ./node_modules/.bin/nodemon --inspect --harmony-async-await src/heimdall.js
fi

echo "Done"