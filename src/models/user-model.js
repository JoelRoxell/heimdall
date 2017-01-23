'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: email => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: 'Email must be a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  salt: String,
  jwts: [{
    type: Schema.Types.ObjectId,
    ref: 'jwt'
  }]
});

UserSchema.methods.authenticate = function authenticate(candidatePassword) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(candidatePassword, this.password, function(err, res) {
      if (err) return reject(err);

      resolve(res);
    });
  }.bind(this));
};

UserSchema.virtual('jwtCount').get(function getJwtCount() {
  return this.jwts.length; // eslint-disable-line
});

// Hash users passords.
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUNDS, 10) || 10, (err, salt) => {
    if (err) throw err;

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) throw err;

      this.password = hash;

      next();
    });
  });
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
