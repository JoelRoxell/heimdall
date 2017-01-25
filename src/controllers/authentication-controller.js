'use strict';

const Router = require('koa-router');

const validateFields = require('../utils/validate-fields');
const factory = require('../utils/factory');
const UserModel = require('../models/user-model');
const jwtUtil = require('../utils/jwt-util');

const authenticateCtrl = new Router();

async function signIn(ctx, next) {
  const { email, password } = ctx.request.body;

  try {
    const user = await UserModel.findByEmail(email);
    const valid = await user.authenticate(password);

    if (!valid) {
      const error = new Error('Authentication failed');

      error.status = 403;

      throw error;
    }

    const tokenPayload = factory.create('Jwt', {
      sub: user._id,
      exp: Math.floor(Date.now() / 1000) + (60 * process.env.TOKEN_EXP_MINUTES || 15),
      data: user.toJSON()
    });

    const signedToken = await jwtUtil.createToken(tokenPayload.toJSON());

    ctx.status = 200;
    ctx.body = signedToken;
  } catch (e) {
    console.log(e);
  }
}

async function signOut(ctx) {
  ctx.body = 'terminated';
}

authenticateCtrl.post('/sign-in', validateFields({
  email: {
    type: String
  },
  password: {
    type: String
  }
}), signIn);

authenticateCtrl.post('/sign-out', signOut);

module.exports = {
  router: authenticateCtrl,
  signIn,
  signOut
};
