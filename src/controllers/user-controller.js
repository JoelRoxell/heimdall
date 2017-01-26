'use strict';

const Router = require('koa-router');
const MongooseError = require('mongoose').Error;

const validateFields = require('../utils/validate-fields');
const factory = require('../utils/factory');
const UserModel = require('../models/user-model');
const jwtUtil = require('../utils/jwt-util');

const userCtrl = new Router();

async function registerUser(ctx, next) {
  const { email, password } = ctx.request.body;

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

async function getUser(ctx) {
  const user = await UserModel.findById(ctx.request.token.sub);

  ctx.body = user.toJSON();
}

userCtrl.post('/register', validateFields({
  email: {
    type: String
  },
  password: {
    type: String
  }
}), registerUser);

userCtrl.get('/', jwtUtil.requireSignedToken, getUser);

module.exports = {
  router: userCtrl,
  registerUser
};
