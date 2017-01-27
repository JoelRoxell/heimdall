'use strict';

const path = require('path');

const modelDir = path.resolve(__dirname, '..', 'models');

function create(modelName, prop = {}) {
  const Model = require(`${modelDir}/${modelName.toLowerCase()}-model.js`);

  return new Model(prop);
}

exports.create = create;
