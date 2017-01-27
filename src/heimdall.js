'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const accesslog = require('koa-accesslog');

require('./bootstrap/mongo').initMongo();
const controllers = require('./controllers');

const heimdall = new Koa();

heimdall.use(async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.body = {
      error: e.message
    };
  }
});

heimdall.use(accesslog());
heimdall.use(bodyParser({
  onerror: function(_, ctx) {
    ctx.status = 422;

    throw new Error('can not parse request body');
  }
}));

heimdall.use(controllers.routes());

heimdall.listen(process.env.PORT, function() {
  console.log('heimdall is running');
});

