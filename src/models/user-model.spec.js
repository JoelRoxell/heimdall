'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const UserModel = require('./user-model');
const JWTModel = require('./jwt-model');
const encrypt = require('../utils/encrypt');

mongoose.Promise = global.Promise;

describe('User model', () => {
  it('should require an email', () => {
    const user = new UserModel();
    const validation = user.validateSync();

    expect(validation.errors.email.message).to.equal('Email is required');
  });

  it('should require a valid email address', () => {
    const user = new UserModel({ email: 'test@test.c' });
    const validation = user.validateSync();

    expect(validation.errors.email.message)
      .to
      .equal('Email must be a valid email address');
  });

  it('should disallow invalid records from being persisted', done => {
    const user = new UserModel();

    user.save().catch(err => {
      expect(err.errors.email.message).to.equal('Email is required');

      done();
    });
  });

  it('should add a jwt to a use', () => {
    const user = new UserModel({
      email: 'test.test@test.com',
      password: 'test'
    });

    const jwt = new JWTModel({
      sub: user._id
    });

    user.jwts.push(jwt);

    expect(user.jwts[0]).to.equal(jwt._id);
  });

  it(`should create a user and provide valid credentials`, function(done) {
    const user = new UserModel({
      email: 'aValid@email.com',
      password: 'SomeCoolPassword'
    });

    const save = sinon.stub(user, 'save');

    save.returns(Promise.resolve(user));

    encrypt.call(user, function() {
      user.save()
        .then(() => user.authenticate('SomeCoolPassword'))
        .then(res => {
          save.restore();

          expect(res).to.equal(true);
          done();
        });
    });
  });

  it('should transform JSON output', () => {
    const user = UserModel({
      email: 'test@test.com',
      password: 'testPassword'
    });
    const json = user.toJSON();

    expect(json).to.deep.equal({
      email: 'test@test.com'
    });
  });

  it('should find user by email', () => {
    const findByEmail = sinon.stub(UserModel, 'findOne');

    findByEmail.returns(UserModel({
      email: 'test@test.com',
      password: 'testPassword'
    }));

    const user = UserModel.findByEmail('test@test.com');

    expect(user.toJSON()).to.deep.equal({
      email: 'test@test.com'
    });
  });
});
