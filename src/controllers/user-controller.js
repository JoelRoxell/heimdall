'use strict';

const Router = require('koa-router');

const factory = require('../utils/factory');
const UserModel = require('../models/user-model');

const MongooseError = require('mongoose').Error;
const userCtrl = new Router();

async function getServiceStatus(ctx, next) {
  ctx.body = 'heimdall is running';
}

async function registerUser(ctx, next) {
  const { email, password } = ctx.request.body;

  if (!email) {
    throw new Error('Missing email parameter');
  }

  if (!password) {
    throw new Error('Missing password parameter');
  }

  const newUser = factory.create('User', {
    email,
    password
  });

  try {
    ctx.body = await newUser.save();
  } catch (e) {
    e instanceof MongooseError ?
      e.status = 400 :
      e.status = 500;

    throw e;
  }
}

userCtrl.get('/', getServiceStatus);
userCtrl.post('/register', registerUser);

module.exports = {
  router: userCtrl,
  getServiceStatus,
  registerUser
};
