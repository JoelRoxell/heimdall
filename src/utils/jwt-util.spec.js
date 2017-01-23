'use strict';

const jwtUtil = require('./jwt-util');
const expect = require('./test-helper').expect;
const jwt = require('jsonwebtoken');

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
  })
});
