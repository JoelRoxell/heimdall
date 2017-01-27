'use strict';

const Router = require('koa-router');

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
    const registredUser = await newUser.save();

    ctx.status = 201;
    ctx.body = registredUser;
  } catch(err) {
    if(err.code === 11000) {
      ctx.status = 409;
      err.message = 'a user with that email already exists';
    }

    throw err;
  }
}

async function getUser(ctx) {
  const user = await UserModel.findById(ctx.request.token.sub);

  ctx.body = user.toJSON();
}
  // TODO: implement mail verification/password reset.
async function sendPasswordResetToken(ctx) {
  ctx.status = 501;
}

async function resetPassword(ctx) {
  let user;

  user = await UserModel.findById(ctx.request.token.sub);

  user.password = ctx.request.body.password;

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
  sendPasswordResetToken,
  getUser,
  resetPassword
};
