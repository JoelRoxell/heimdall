'use strict';

const Router = require('koa-router');

const validateFields = require('../utils/validate-fields');

const authenticateCtrl = new Router();

async function signIn(ctx, next) {
  ctx.body = 'Sign in';
}

async function signOut(ctx) {
  ctx.body = 'terminated';
}

authenticateCtrl.post('/sign-in', validateFields(['email', 'password']), signIn);
authenticateCtrl.post('/sign-out', signOut);

module.exports = {
  router: authenticateCtrl,
  signIn,
  signOut
};
