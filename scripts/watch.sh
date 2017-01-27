export TERM=xterm

./node_modules/.bin/nodemon --exec "NODE_ENV=test ./node_modules/.bin/mocha  --harmony-async-await './src/**/*.spec.js'"
