'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const accesslog = require('koa-accesslog');

const controllers = require('./controllers');

const heimdall = new Koa();

heimdall.use(accesslog());
heimdall.use(bodyParser());

heimdall.use(controllers.routes());

console.log(process.env.PORT);
heimdall.listen(process.env.PORT, function() {
  console.log('Running');
});
