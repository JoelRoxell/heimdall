'use strict';

const router = require('koa-router')();

const user = require('./user-controller');

router
  .use('/user', user.router.routes());

module.exports = router;
