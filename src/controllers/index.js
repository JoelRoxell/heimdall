'use strict';

const router = require('koa-router')();

const user = require('./user-controller');
const auth = require('./authentication-controller');

router
  .use('/user', user.router.routes())
  .use('/auth', auth.router.routes());

module.exports = router;
