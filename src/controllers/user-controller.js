'use strict';

const Router = require('koa-router');

const UserModel = require('../models/user-model');
const MongooseError = require('mongoose').Error;

const userCtrl = new Router();

async function getServiceStatus(ctx, next) {
  await next();

  ctx.body = 'heimdall is running';
}

async function registerUser(ctx, next) {
  next();

  const { email, password } = ctx.request.body;

  if (!email) {
    throw new Error('Missing email parameter')
  }

  if (!password) {
    throw new Error('Missing password parameters');
  }

  const newUser = new UserModel({
    email,
    password
  });


  let registerdUser;

  try {
    registerdUser = await newUser.save();
  } catch (e) {
    e instanceof MongooseError ?
      e.status = 400 :
      e.status = 500;

    throw e;
  }

  ctx.body = registerdUser;
}

userCtrl.get('/', getServiceStatus);
userCtrl.post('/register', registerUser);

module.exports = {
  router: userCtrl,
  getServiceStatus,
  registerUser
};
