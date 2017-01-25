'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JWTSchema = new Schema({
  sub: String,
  exp: Number,
  data: Schema.Types.Mixed
});

// Remove _id from JSON convertions.
if (!JWTSchema.options.toJSON) JWTSchema.options.toJSON = {};
JWTSchema.options.toJSON.transform = function(doc, ret, options) {
  delete ret._id;

  return ret;
};

const JWTModel = mongoose.model('jwt', JWTSchema);

module.exports = JWTModel;
