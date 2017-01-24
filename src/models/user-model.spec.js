'use strict';

const { expect } = require('../utils/test-helper');
const UserModel = require('./user-model');
const JWTModel = require('./jwt-model');

describe('User model', () => {
  it('should require an email', () => {
    const user = new UserModel();
    const validation = user.validateSync();

    expect(validation.errors.email.message).to.equal('Email is required');
  });

  it('should require a valid email address', () => {
    const user = new UserModel({ email: 'test@test.c' });
    const validation = user.validateSync();

    expect(validation.errors.email.message).to.equal('Email must be a valid email address');
  });

  it('should disallow invalid records from being persisted', done => {
    const user = new UserModel();

    user.save().catch(err => {
      expect(err.errors.email.message).to.equal('Email is required');

      done();
    });
  });

  it('should add a jwt to a use', done => {
    const user = new UserModel({
      email: 'test.test@test.com',
      password: 'test'
    });

    new JWTModel()
      .save()
      .then(doc => {
        user.jwts.push(doc);
        return user.save();
      })
      .then(doc => {
        expect(user.jwtCount).to.equal(1);
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it(`should create a user and validate it's credentials`, function(done) {
    const user = new UserModel({
      email: 'aValid@email.com',
      password: 'SomeCoolPassword'
    });

    user.save()
      .then(() => user.authenticate('SomeCoolPassword'))
      .then(res => {
        expect(res).to.equal(true);

        done();
      });
  });
});
