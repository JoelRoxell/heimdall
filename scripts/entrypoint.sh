#!/bin/bash

# Catch termination signals and forward them to the sub-process.
handler() {
  if [ $pid -ne 0 ]; then # 0 is the docker entrypoint
    # tell the node process to gracefully shut down
    kill -SIGTERM "$pid"

    # wait for it to die
    wait "$pid"
  fi
}

trap 'kill ${!}; handler' SIGTERM

# Start consul agent
/opt/nakd-consul/start.sh &

# Start application
if [ "${NODE_ENV}" = "production" ]; then
  echo "Running in production mode..."
  node --harmony-async-await src/heimdall.js &
elif [ "${NODE_ENV}" = "development" ]; then
  echo "Running in development mode mode..."
  DEBUG=* ./node_modules/.bin/nodemon --inspect --harmony-async-await src/heimdall.js &
fi

pid="$!" # get the PID from the last output (started process)
echo "Process $pid spawned"

wait $pid

# Leave consule cluster before termination.
consul leave
