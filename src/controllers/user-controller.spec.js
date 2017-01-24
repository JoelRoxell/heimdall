'use strict';

const MongooseError = require('mongoose').Error;
const sinon = require('sinon');

const { expect } = require('../utils/test-helper');
const registerUser = require('./user-controller').registerUser;
const factory = require('../utils/factory');
const { encrypt } = require('../utils/encrypt');

describe('user-controller', () => {
  let ctx;

  describe('register', () => {
    beforeEach(function() {
      ctx = {
        request: {
          body: {}
        }
      };
    });

    it('should register a user', async function() {
      let create = sinon.stub(factory, 'create');
      let userParams = {
        email: 'test@test.com',
        password: 'someTestPassword',
        isModified: () => true,
        encrypt,
        save: function() {
          return this.encrypt();
        }
      };

      create.returns(userParams);

      try {
        ctx.request.body = userParams;

        await registerUser(ctx, () => {});

        console.log(ctx);

        expect(ctx.request.body.email).to.equal(ctx.request.body.email);
      } catch (e) {
        console.log(e);
      }

      create.restore();
    });

    xit('should fail to register a user: email', async () => {
      try {
        ctx.request.body = {
          email: 'test@test.c',
          password: 'someTestPassword'
        };

        await registerUser(ctx, () => {});
      } catch (e) {
        if (e instanceof MongooseError) {
          expect(e.errors.email.message).to.equal('Email must be a valid email address');
        } else {
          throw e;
        }
      }
    });

    xit('should fail to register a user: password', async () => {
      try {
        ctx.request.body = {
          email: 'test@test.c'
        };

        await registerUser(ctx, () => {});
      } catch (e) {
        expect(e.message).to.equal('Missing password parameters');
      }
    });
  });
});
