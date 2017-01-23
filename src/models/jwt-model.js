'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JWTSchema = new Schema({
  sub: String,
  role: {
    type: String,
    default: null
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
});

const JWTModel = mongoose.model('JWT', JWTSchema);

module.exports = JWTModel;
