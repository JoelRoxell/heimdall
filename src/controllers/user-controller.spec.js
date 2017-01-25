'use strict';

const MongooseError = require('mongoose').Error;
const sinon = require('sinon');
const expect = require('chai').expect;

const registerUser = require('./user-controller').registerUser;
const factory = require('../utils/factory');
const encrypt = require('../utils/encrypt');

describe('user-controller', () => {
  let ctx;
  let create;
  let userParams;

  describe('register', () => {
    beforeEach(function() {
      ctx = {
        request: {
          body: {}
        },
        body: {}
      };

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

    afterEach(function() {
      create.restore();
    });

    it('should register a user', async function() {
      try {
        ctx.request.body = {
          email: 'test@test.com',
          password: 'someTestPassword'
        };

        await registerUser(ctx, () => {});

        expect(ctx.body.email).to.equal(ctx.request.body.email);
        expect(ctx.body).to.have.property('password');
      } catch (err) {
        throw err;
      }
    });

    it('should fail to register a user: email', async () => {
      try {
        ctx.request.body = {
          email: 'test@test.c',
          password: 'someTestPassword'
        };

        await registerUser(ctx, () => {});
      } catch (e) {
        console.log(e);
        if (e instanceof MongooseError) {
          expect(e.errors.email.message).to.equal('Email must be a valid email address');
        } else {
          throw e;
        }
      }
    });

    it('should fail to register a user: password', async () => {
      try {
        ctx.request.body = {
          email: 'test@test.c'
        };

        await registerUser(ctx, () => {});
      } catch (e) {
        expect(e.message).to.equal('Missing password parameter');
      }
    });
  });
});
