'use strict';

const expect = require('../utils/test-helper').expect;

const JWTModel = require('./jwt-model');

describe('JWT model', () => {
  it('should create models', () => {
    const jwt = new JWTModel();

    expect(jwt).to.exist;
  });
});
