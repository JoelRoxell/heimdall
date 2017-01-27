'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;

const UserModel = require('../models/user-model');
const { registerUser, getUser, resetPassword } = require('./user-controller');
const factory = require('../utils/factory');
const encrypt = require('../utils/encrypt');

describe('user-controller', () => {
  let ctx;
  let userParams;

  beforeEach(function() {
    ctx = {
      request: {
        body: {},
        token: {
          sub: 123
        }
      },
      body: {}
    };
  });

  // FIXME: Refactor and stub this test correctly.
  describe('register', () => {
    let create;

    beforeEach(function() {
      create = sinon.stub(factory, 'create');

      userParams = {
        email: 'test@test.com',
        password: 'someTestPassword',
        isModified: () => true,
        encrypt,
        save: function() {
          return new Promise((resolve, reject) => {
            this.encrypt(() => {
              resolve(this);
            });
          });
        }
      };

      create.returns(userParams);
    });

    afterEach(() => {
      create.restore();
    });

    it('should register a user', async function() {
      ctx.request.body = {
        email: 'test@test.com',
        password: 'someTestPassword'
      };

      await registerUser(ctx, () => {});

      expect(ctx.body.email).to.equal(ctx.request.body.email);
      expect(ctx.body).to.have.property('password');
    });
  });

  it('should get user info', async () => {
    const findById = sinon.stub(UserModel, 'findById');

    findById.returns({
      email: 'test@test.com',
      toJSON() {
        return { email: 'test@test.com' };
      }
    });

    await getUser(ctx);

    findById.restore();
    expect(ctx.body).to.have.property('email', 'test@test.com');
  });

  it('should reset user password', async () => {
    ctx.request.body.password = 'abc123';

    const findById = sinon.stub(UserModel, 'findById');

    findById.returns({
      email: 'test@test.com',
      toJSON() {
        return { email: 'test@test.com' };
      },
      save() {
        return new Promise((resolve, reject) => {
          encrypt.call(ctx.request.body, () => {
            resolve(Object.assign(
              ctx.request.body
            ));
          });
        });
      }
    });

    await resetPassword(ctx);

    expect(ctx.body.password.length > 10).to.equal(true);
  });
});
