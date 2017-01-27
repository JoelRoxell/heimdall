'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('mongoose');

const db = process.env.NODE_ENV === 'production' ? 'production' : 'development';

function initMongo() {
  return new Promise(function(resolve, reject) {
    if (mongoose.connection.readyState > 0) {
      debug('already connected.');

      return;
    }

    mongoose.Promise = global.Promise;

    mongoose.connect(`mongodb://mongo/auth_${db}`).catch(err => {
      debug(err);
      reject(err);
    });

    mongoose.connection
      .once('open', () => {
        debug('connected to mongo');
      })
      .on('error', err => debug(err));
  });
}

function close() {
  return new Promise(function(resolve, reject) {
    mongoose.connection.close(function() {
      resolve();
    });
  });
}

function dropDatabase(collection) {
  return new Promise((resolve, reject) => {
    mongoose.connection.dropDatabase(err => {
      if (err) {
        reject(err);
      }

      resolve('OK');
    });
  });
}

exports.initMongo = initMongo;
exports.close = close;
exports.dropDatabase = dropDatabase;
