#!/bin/bash
# Figure out the main container name
MAIN_SERVICE_NAME=$(cat docker-compose.yml | \
  grep ": # Main" | \
  grep -o -E '\s{2}(\w+):' | \
  grep -o -E '(\w+)')

docker ps --filter name="${MAIN_SERVICE_NAME}_(\d+)" -q
