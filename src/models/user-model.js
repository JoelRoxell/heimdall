'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const encrypt = require('../utils/encrypt');

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator:
        email => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: 'Email must be a valid email address'
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  jwts: [{
    type: Schema.Types.ObjectId,
    ref: 'jwt'
  }]
});

// Remove critical data from JSON outputs.
if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};
UserSchema.options.toJSON.transform = function toJSON(doc, ret, options) {
  delete ret._id;
  delete ret.password;
  delete ret.jwts;
  delete ret.__v;

  return ret;
};

UserSchema.statics.findByEmail = function findByEmail(email) {
  return this.findOne({ email });
};

UserSchema.methods.authenticate = function authenticate(candidatePassword) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(candidatePassword, this.password, function(err, res) {
      if (err) return reject(err);

      resolve(res);
    });
  }.bind(this));
};

UserSchema.pre('save', encrypt);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
