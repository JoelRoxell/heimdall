'use strict';

const expect = require('chai').expect;

const JWTModel = require('./jwt-model');

describe('JWT model', () => {
  it('should create models', () => {
    const jwt = new JWTModel();

    expect(jwt).to.have.property('sub');
  });
});
