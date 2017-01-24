const { expect, tareDownCollection } = require('../utils/test-helper');

const MongooseError = require('mongoose').Error;

const registerUser = require('./user-controller').registerUser;

describe('user-controller', () => {
  let ctx;

  beforeEach(function() {
    ctx = {
      request: {
        body: {}
      }
    }
  });

  describe('register', () => {
    it('should register a user', async () => {
      try {
        ctx.request.body = {
          email: 'test@test.com',
          password: 'someTestPassword'
        };

        await registerUser(ctx, () => {});

        expect(ctx.body.email).to.equal(ctx.request.body.email);
        expect(ctx.body.jwts.length).to.equal(0);
      } catch (e) {
        throw e;
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
        expect(e.message).to.equal('Missing password parameters');
      }
    });
  });
});
