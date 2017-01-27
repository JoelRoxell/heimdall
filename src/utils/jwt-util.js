'use strict';

const jwt = require('jsonwebtoken');

const key = process.env.SECRET;

function createToken(payload, opt = {}) {
  return new Promise(function(resolve, reject) {
    jwt.sign(payload, key, opt, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

function verifyToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, key, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
};

async function requireSignedToken(ctx, next) {
  const authHeader = ctx.headers.authorization;

  if(!authHeader) {
    ctx.status = 400;

    throw new Error('No autohrizatin header was passed in the request');
  }

  const [type, encodeToken] = authHeader.split(' ');

  if (type !== 'Bearer') {
    ctx.status = 400;

    throw new Error('Authorization header is of wrong type');
  }

  try {
    const decodedToken = await verifyToken(encodeToken);

    ctx.request.token = decodedToken;
  } catch (err) {
    ctx.status = 403;

    throw err;
  }
  await next();
};

exports.createToken = createToken;
exports.requireSignedToken = requireSignedToken;
exports.verify = verifyToken;
