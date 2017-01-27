'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const UserModel = require('../models/user-model');

const { signIn } = require('./authentication-controller');
const factory = require('../utils/factory');

describe('authenticateCtrl', () => {
  let ctx;
  let create;

  beforeEach(() => {
    create = sinon.stub(factory, 'create');

    ctx = {
      request: {
        body: {}
      },
      body: {}
    };

    create.returns({
      sub: 'test-1111',
      exp: Math.floor(Date.now() / 1000) +
        (60 * process.env.TOKEN_EXP_MINUTES || 15),
      data: {
        email: {
          email: 'test@test.com'
        },
        grants: {
          auth: {
            signin: true,
            reset: true
          }
        }
      },
      toJSON() {
        return {
          email: 'test@test.com',
          password: '123456'
        };
      }
    });
  });

  afterEach(() => {
    create.restore();
  });

  it('should sign in', async () => {
    const findByEmail = sinon.stub(UserModel, 'findByEmail');

    findByEmail.returns({
      email: 'test@test.com',
      password: '123456',
      authenticate() { return Promise.resolve(true); }
    });

    ctx.request.body = {
      email: 'test@test.com',
      password: '123456'
    };

    await signIn(ctx);

    findByEmail.restore();

    expect(ctx.body).to.have.property('token');
  });
});
