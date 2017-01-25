'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JWTSchema = new Schema({
  sub: String
});

const JWTModel = mongoose.model('jwts', JWTSchema);

module.exports = JWTModel;
