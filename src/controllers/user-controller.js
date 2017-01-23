'use strict';

const Router = require('koa-router');

const userCtrl = new Router();

async function getServiceStatus(ctx, next) {
  await next();

  ctx.body = 'heimdall is running';
}

userCtrl.get('/', getServiceStatus);

module.exports = {
  router: userCtrl,
  getServiceStatus
};
