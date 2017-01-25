'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const UserModel = require('../models/user-model');
const encrypt = require('../utils/encrypt');
const jwtUtil = require('../utils/jwt-util');

const factory = require('../utils/factory');
const { signIn, signOut } = require('./authentication-controller');

describe('authenticateCtrl', () => {
  let ctx;
  let user;

  beforeEach(() => {
    ctx = {
      request: {
        body: {}
      },
      body: {}
    };
  });

  it('should authenticate a user and recieve a encoded token', async () => {
    ctx.request.body = {
      email: 'test@test.com',
      password: '123456'
    };

    const mockUser = new UserModel({
      email: 'test@test.com',
      password: '123456'
    });

    const findByEmail = sinon.stub(UserModel, 'findByEmail');

    findByEmail.returns(Promise.resolve(mockUser));

    encrypt.call(mockUser, async () => {
      try {
        await signIn(ctx);
      } catch (e) {
        throw e;
      }

      const decodedToken = await jwtUtil.verify(ctx.body);

      findByEmail.restore();

      expect(decodedToken).to.have.property('sub');
      expect(decodedToken).to.have.property('iat');
      expect(decodedToken).to.have.property('exp');
    });
  });
});
