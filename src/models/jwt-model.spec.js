'use strict';

const { expect, tareDownCollection } = require('../utils/test-helper');

const JWTModel = require('./jwt-model');

xdescribe('JWT model', () => {
  before(async () => {
    await tareDownCollection('jwts');
  });

  it('should create models', () => {
    const jwt = new JWTModel();

    expect(jwt).to.exist;
  });
});
