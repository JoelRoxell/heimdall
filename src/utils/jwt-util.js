'use strict';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const secretPassage = path.join(__dirname, '../../.ssh/');

const cert = fs.readFileSync(path.join(secretPassage, 'secret.pem'));
const publicKey = fs.readFileSync(path.join(secretPassage, 'secret.pub'));

function createToken(payload, opt = { algorithm: 'RS256' }) {
  return new Promise(function(resolve, reject) {
    jwt.sign(payload, cert, opt, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

function verifyToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, publicKey, (err, decodedToken) => {
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
