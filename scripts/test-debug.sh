#!/bin/bash
export TERM=xterm

./node_modules/.bin/nodemon --inspect=9223 --debug-brk --exec "NODE_ENV=test ./node_modules/.bin/mocha  --harmony-async-await './src/**/*.spec.js'"
