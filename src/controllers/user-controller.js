'use strict';

const Router = require('koa-router');
const MongooseError = require('mongoose').Error;

const validateFields = require('../utils/validate-fields');
const factory = require('../utils/factory');

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

const validator = validateFields({
  email: {
    type: String
  },
  password: {
    type: String
  }
});

userCtrl.post('/register', validator, registerUser);

module.exports = {
  router: userCtrl,
  registerUser
};
