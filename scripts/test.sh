#!/bin/bash
export TERM=xterm

./node_modules/.bin/mocha --harmony-async-await './src/**/*.spec.js'
