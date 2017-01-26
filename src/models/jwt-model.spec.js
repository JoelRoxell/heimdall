'use strict';

const expect = require('chai').expect;

const JWTModel = require('./jwt-model');

describe('JWT model', () => {
  it('should create models', () => {
    const jwt = new JWTModel();

    expect(jwt).to.have.property('sub');
  });

  it('toJSON should remove _id attr', () => {
    const jwt = new JWTModel({
      sub: 'test'
    });

    const json = jwt.toJSON();

    expect(json).to.deep.equal({
      sub: 'test'
    });
  });
});
