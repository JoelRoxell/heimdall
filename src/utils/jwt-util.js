'use strict';

const jwt = require('jsonwebtoken');

const key = process.env.SECRET;

exports.createToken = function createToken(payload, opt = {}) {
  return new Promise(function(resolve, reject) {
    jwt.sign(payload, key, opt, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

exports.verify = function verifyToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, key, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
};
