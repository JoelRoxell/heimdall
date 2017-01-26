'use strict';

const Router = require('koa-router');

async function healthCheck(ctx, next) {
  ctx.body = {
    status: 'OK'
  };
}

const statCtrl = new Router();

statCtrl.get('/', healthCheck);

module.exports = {
  router: statCtrl,
  healthCheck
};
