#!/bin/bash
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  node --harmony-async-await src/heimdall.js
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode. Installing dev-dependencies..."
  yarn
  ./node_modules/.bin/nodemon --inspect=9222 --harmony-async-await src/heimdall.js
fi
