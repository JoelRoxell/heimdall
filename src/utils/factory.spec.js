'use-strict';

const factory = require('./factory');
const expect = require('./test-helper').expect;

describe('factory', function() {
  it('should create a new model', () => {
    const jwt = factory.create('Jwt', { sub: 'test' });

    expect(jwt).to.have.property('sub', 'test');
  });
});
