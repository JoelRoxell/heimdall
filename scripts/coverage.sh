#!/bin/bash
export TERM=xterm
rm -r ./coverage/*
./node_modules/.bin/nyc --show-process-tree \
  ./node_modules/.bin/mocha --harmony-async-await './src/**/*.spec.js'
