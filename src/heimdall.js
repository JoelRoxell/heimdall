'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const accesslog = require('koa-accesslog');
const router = require('koa-router')();

require('./bootstrap/mongo').initMongo();
require('./bootstrap/kafka');
const controllers = require('./controllers');

const heimdall = new Koa();

const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.resolve(
    __dirname,
    '..',
    'log/heimdall/access.log')
  , {
    flags: 'a'
  });

heimdall.use(accesslog(logStream));
heimdall.use(async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.body = {
      error: e.message
    };
  }
});
heimdall.use(bodyParser({
  onerror: function(_, ctx) {
    ctx.status = 422;

    throw new Error('can not parse request body');
  }
}));

heimdall.use(router.use('/heimdall', controllers.routes()).routes());

heimdall.listen(8000 || process.env.PORT, function() {
  console.log('heimdall is running.');
});

