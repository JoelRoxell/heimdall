'use strict';

const Router = require('koa-router');
const MongooseError = require('mongoose').Error;

const validateFields = require('../utils/validate-fields');
const factory = require('../utils/factory');
const UserModel = require('../models/user-model');
const { requireSignedToken } = require('../utils/jwt-util');

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
  // TODO: implement mail verification.
async function sendPasswordResetToken(ctx) {
  ctx.status = 501;
}

async function resetPassword(ctx) {
  debugger;

  let user;

  try {
    user = await UserModel.findById(ctx.request.token.sub);
  } catch (error) {
    console.log(error);

    throw error;
  }

  user.password = ctx.request.body.password;

  console.log(user);

  const updatedUser = await user.save();

  ctx.body = updatedUser;
}

userCtrl.post('/register', validateFields({
  email: {
    type: String
  },
  password: {
    type: String
  }
}), registerUser);

userCtrl.get('/', requireSignedToken, getUser);
userCtrl.put('/reset-password',
  validateFields({
    password: {
      type: String,
      message: 'password is a required parameter'
    }
  }),
  requireSignedToken,
  resetPassword
);
userCtrl.post('/rest-password', sendPasswordResetToken);

module.exports = {
  router: userCtrl,
  registerUser,
  sendPasswordResetToken
};
