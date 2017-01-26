'use strict';

const expect = require('chai').expect;

const jwtUtil = require('./jwt-util');

describe('jwt util', () => {
  let token;

  beforeEach(async function() {
    try {
      token = await jwtUtil.createToken({
        foo: 'bar'
      });
    } catch(err) {
      throw err;
    }
  });

  it('should create verify an invalid token', async () => {
    const token = await jwtUtil.createToken({
      foo: 'bar'
    });

    let splittedJwt = token.split('.');

    const encodedPayload = new Buffer(splittedJwt[1], 'base64').toString();
    const payload = JSON.parse(encodedPayload);

    payload.adming = true;

    splittedJwt[1] = new Buffer(JSON.stringify(payload)).toString('base64');

    try {
      await jwtUtil.verify(splittedJwt.join('.'));
    } catch (e) {
      expect(e.message).to.equal('invalid token');
    }
  });

  it('should create a expired token', async () => {
    try {
      token = await jwtUtil.createToken({
        foo: 'bar',
        exp: -30
      });

      await jwtUtil.verify(token);
    } catch (e) {
      expect(e.message).to.equal('jwt expired');
    }
  });

  it('should fail to create a token', async () => {
    try {
      token = await jwtUtil.createToken();
    } catch (err) {
      expect(err).to.exist;
    }
  });

  describe('verify token middleware', () => {
    it('should require a signed token through middleware', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer ' + token
        },
        request: {}
      };

      await jwtUtil.requireSignedToken(ctx, () => {});

      expect(ctx.request.token).to.exist;
    });

    it('should fail with no authorization header', async () => {
      const ctx = {
        headers: {},
        request: {}
      };

      try {
        await jwtUtil.requireSignedToken(ctx, () => {});
      } catch(_) {
        expect(ctx.status).to.equal(400);
      }
    });

    it('should fail with wrong authorization header', async () => {
      const ctx = {
        headers: {
          authorization: 'WrongType ' + token
        },
        request: {}
      };

      try {
        await jwtUtil.requireSignedToken(ctx, () => {});
      } catch(_) {
        expect(ctx.status).to.equal(400);
      }
    });
  });
});
