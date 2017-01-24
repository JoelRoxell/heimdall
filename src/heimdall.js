'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const accesslog = require('koa-accesslog');

require('./bootstrap/mongo').initMongo();
const controllers = require('./controllers');

const heimdall = new Koa();

heimdall.use(accesslog());
heimdall.use(bodyParser());

heimdall.use(controllers.routes());

heimdall.listen(process.env.PORT, function() {
  console.log('heimdall is running');
});
