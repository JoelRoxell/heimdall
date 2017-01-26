'use strict';

const Router = require('koa-router');

const validateFields = require('../utils/validate-fields');
const factory = require('../utils/factory');
const UserModel = require('../models/user-model');
const jwtUtil = require('../utils/jwt-util');

async function signIn(ctx, next) {
  const { email, password } = ctx.request.body;

  const user = await UserModel.findByEmail(email);
  const valid = await user.authenticate(password);

  if (!valid) {
    ctx.status = 401;

    throw new Error('authentication failed');
  }

  const tokenPayload = factory.create('Jwt', {
    sub: user._id,
    exp: Math.floor(Date.now() / 1000) +
      (60 * process.env.TOKEN_EXP_MINUTES || 15),
    data: {
      email: user.email,
      grants: {
        auth: {
          signin: true,
          reset: true
        }
      }
    }
  });

  const signedToken = await jwtUtil.createToken(tokenPayload.toJSON());

  ctx.status = 200;
  ctx.body = { token: signedToken };
}

const authenticateCtrl = new Router();

authenticateCtrl.post('/sign-in', validateFields({
  email: {
    type: String
  },
  password: {
    type: String
  }
}), signIn);

module.exports = {
  router: authenticateCtrl,
  signIn
};
