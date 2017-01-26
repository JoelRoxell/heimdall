'use strict';

const router = require('koa-router')();

const user = require('./user-controller');
const auth = require('./authentication-controller');
const stat = require('./health-check');

router
  .use('/user', user.router.routes())
  .use('/auth', auth.router.routes())
  .use('/stat', stat.router.routes());

module.exports = router;
