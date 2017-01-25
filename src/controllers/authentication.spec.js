'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const UserModel = require('../models/user-model');

const factory = require('../utils/factory');
const { signIn, signOut } = require('./authentication-controller');

describe('authenticateCtrl', () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      request: {
        body: {}
      },
      req: {
        body: {}
      }
    };
  });

  it('should authentcate a user', async () => {
    const user = factory.create('User', {
      email: 'test@test.com',
      password: '12345'
    });

    ctx.req.body = {
      email: 'test@test.com',
      password: '123456'
    };

    const save = sinon.stub(user, 'save');

    save.returns(Promise.resolve(true));
    save.restore();

    console.log(signIn);

    await signIn(ctx);

    console.log(ctx);

    expect(ctx.body).to.exist;
  });
});
